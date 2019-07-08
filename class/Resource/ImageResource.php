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

 namespace slideshow\Resource;

 class ImageResource extends BaseAbstract
 {

     protected $showId;
     protected $slideIndex;
     protected $title;
     protected $filepath;
     protected $url;
     protected $height;
     protected $width;
     protected $type;
     protected $position;

     protected $table = 'ss_media';

     public function __construct()
     {
         parent::__construct();
         $this->showId = new \phpws2\Variable\IntegerVar(0, 'showId');
         $this->slideIndex = new \phpws2\Variable\IntegerVar(0, 'slideIndex');
         $this->title = new \phpws2\Variable\StringVar(null, 'title');
         $this->filepath = new \phpws2\Variable\FileVar(null, 'filepath');
         $this->filepath->allowNull(true);
         $this->url = new \phpws2\Variable\StringVar(null, 'url');
         $this->url->allowEmpty(1);
         $this->width = new \phpws2\Variable\IntegerVar(0, 'width');
         $this->width->setRange(0, 20000);
         $this->height = new \phpws2\Variable\IntegerVar(0, 'height');
         $this->height->setRange(0, 20000);
         $this->type = new \phpws2\Variable\StringVar(null, 'type');
         $this->position = new \phpws2\Variable\StringVar('right', 'position');
     }
 }
