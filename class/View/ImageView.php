<?php
/**
 * MIT License
 * Copyright (c) 2019 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Tyler Craig <craigta1@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

 namespace slideshow\View;

 use phpws2\Template;
 use slideshow\Resource\ImageResource;

 class ImageView extends BaseView
 {
     public function view(ImageResource $image)
     {
         return $this->imageView($image);
     }

     private function imageView(ImageResource $image)
     {
         $vars = $this->getImageVars($image);
         $template = new Template($vars);
         $template->setModuleTemplate('slideshow', 'Slide/image.html');
         return $template->get();
     }

     private function getImageVars(ImageResource $image)
     {
         $vars = $image->getStringVars();

         // TODO Handle any misc vars

         return $vars;
     }
 }
