<?php
/**
* MIT License
* Copyright (c) 2019 Electronic Student Services @ Appalachian State University
*
* See LICENSE file in root directory for copyright and distribution permissions.
*
* @author Tyler Craig <craigta1@appstate.edu>
* @author Matthew McNaney <mcnaneym@appstate.edu>
* @license https://opensource.org/licenses/MIT
*/

namespace slideshow\Factory;

use Canopy\Request;
use phpws2\Database;
use slideshow\Resource\ImageResource as Resource;
use slideshow\UploadHandler;

define('SLIDESHOW_MEDIA_DIRECTORY', './images/slideshow/');

class ImageFactory extends Base
{

    public function build()
    {
        return new Resource;
    }

    public function post(Request $request)
    {

        $showId = $request->pullPostVar('showId');
        $slideIndex = $request->pullPostVar('index');

        try {
            // If there is already an image at the current slide and show
            $id = $this->getId($showId, $slideIndex);
            $image = $this->load($id);
            $this->delete($showId, $slideIndex);
        }
        catch (\Exception $e) {
            // Else we make a new image
            $image = $this->build();
        }

        $image->showId = $showId;
        $image->slideIndex = $slideIndex;

        $image->title = $request->pullPostString('title');
        $image->width = $request->pullPostInteger('width');
        $image->height = $request->pullPostInteger('height');
        $image->type = $request->pullPostString('type');

        try {
            $result = $this->upload(intval($image->showId), intval($image->slideIndex));
            $image->filepath = $result['filepath'];
        }
        catch (\Exception $e) {
            $this->delete($image->showId, $image->slideIndex);
            return $e;
        }
        $this->saveResource($image, 'ss_media');
        return $image->title;
    }

    public function put(Request $request, $imageId=null, $showId=null, $slideIndex=null)
    {
        // Maybe pull these fields from the request
        if ($imageId == null) {
            $imageId = $this->getID($showId, $slideIndex);
        }
        $image = $this->load($imageId);
    }

    private function delete($showId, $slideIndex)
    {
        $imageId = $this->getId($showId, $slideIndex);
        //var_dump($imageId);
        $image = $this->load($imageId);

        if (!isset($_FILES) || !isset($_FILES['file'])) {
            throw new \Exception('Upload missing image/media file.');
        }
        $file = $_FILES['file'];
        $result = $this->deleteImage($file, $showId, $slideIndex);
        //var_dump($result);
        try {
            unlink($image->filepath);
            $this->deleteResource($image);
        }
        catch (\Exception $e) {
            $this->deleteResource($image);
        }
    }

    private function getId($showId, $slideIndex)
    {
        if ($showId == null || $showId == -1) {
          throw new \Exception("ShowId is not valid: $showId", 1);
        }
        $sql = "SELECT id FROM ss_media WHERE showId=:showId AND slideIndex=:slideIndex;";
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('showId'=>$showId, 'slideIndex'=>$slideIndex));
        $id = $q->fetchColumn(0);
        return intval($id);
    }

    /**
    *
    * @staticvar array $imageTypes
    * @staticvar array $videoTypes
    * @param int $showId
    * @param int $slideIndex
    * @return array
    * @throws \Exception
    */
    public function upload(int $showId, int $slideIndex)
    {
        if (!isset($showId) || !isset($slideIndex)) {
            throw new \Exception('Missing slideshow and slide');
        }
        static $imageTypes = array('image/jpeg', 'image/png', 'image/gif');
        // Not functional:
        static $videoTypes = array('video/webm', 'video/mp4');
        //var_dump($_FILES);
        if (!isset($_FILES) || !isset($_FILES['file'])) {
            throw new \Exception('Upload missing image/media file.');
        }
        $file = $_FILES['file'];
        if (in_array($file['type'], $imageTypes)) {
            $result = $this->saveImage($file, $showId, $slideIndex);
            $result['type'] = 0;
        } elseif (in_array($file['type'], $videoTypes)) {
            // TODO: in a future update
            //$result = $this->saveMedia($file, $showId, $slideIndex);
            //$result['type'] = 1;
        } else {
            throw new \Exception('File Type Not Supported.');
        }
        return $result;
    }

    private function saveImage(array $file, int $showId, int $slideIndex)
    {
        $filepath = $this->moveImage($file, $showId, $slideIndex);
        return ['filepath' => $filepath];
    }

    public function moveImage($pic, int $showId, int $slideIndex)
    {
        if ($pic['error'] !== 0) {
            throw new \Exception('Upload error');
        }
        $destination = SLIDESHOW_MEDIA_DIRECTORY . $showId . '/' . $slideIndex  . '/';
        $options = $this->getImageOptions($pic, $destination, $showId, $slideIndex);
        $upload_handler = new UploadHandler($options, false);
        $result = $upload_handler->post(false);
        return $destination . $result['file'][0]->name;
    }

    public function deleteImage(array $pic, int $showId, int $slideIndex)
    {
        $imageDirectory = SLIDESHOW_MEDIA_DIRECTORY . $showId . '/' . $slideIndex . '/';
        $imagePath = PHPWS_HOME_DIR . $imageDirectory;
        $options = array(
            'upload_dir' => $imagePath,
            'upload_url' => \Canopy\Server::getSiteUrl(true) . $imageDirectory,
            'param_name' => 'file',
            'delete_type' => 'DELETE'
        );
        $upload_handler = new UploadHandler($options, false);
        $result = $upload_handler->delete();
        return $result;
    }

    private function getImageOptions($pic, $imageDirectory, int $showId, int $slideIndex)
    {
        $imageDirectory = SLIDESHOW_MEDIA_DIRECTORY . $showId . '/' . $slideIndex . '/';
        $imagePath = PHPWS_HOME_DIR . $imageDirectory;
        $options = array(
            'max_width' => SLIDESHOW_SYSTEM_SETTINGS['maxWidth'],
            'max_height' => SLIDESHOW_SYSTEM_SETTINGS['maxHeight'],
            'param_name' => 'file',
            'upload_dir' => $imagePath,
            'upload_url' => \Canopy\Server::getSiteUrl(true) . $imageDirectory,
            'image_versions' => array()
        );
        return $options;
    }


}
