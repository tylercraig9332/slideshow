<?php

/**
* @author Matthew McNaney <mcnaneym at appstate dot edu>
* @author Tyler Craig <craigta1 at appstate dot edu>
*/

use phpws2\Database;
require_once PHPWS_SOURCE_DIR . 'mod/slideshow/boost/Tables.php';

function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    try {
        $tables = new slideshow\Tables;

        $show = $tables->createShow();
        $session = $tables->createSession();
        $slide = $tables->createSlide();
        $image = $tables->createImage();

    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

        if (isset($show) && $db->tableExitsts($show->getName())) {
            $show->drop(true);
        }
        if (isset($session) && $db->tableExitsts($session->getName())) {
            $session->drop(true);
        }
        if (isset($slide) && $db->tableExitsts($slide->getName())) {
            $slide->drop(true);
        }
        if (isset($image) && $db->tableExitsts($image->getName())) {
            $image->drop(true);
        }

        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
