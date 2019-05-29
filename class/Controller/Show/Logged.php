<?php

/*
 * See docs/AUTHORS and docs/COPYRIGHT for relevant info.
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @author Matthew McNaney <mcnaney at gmail dot com>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Controller\Show;

use Canopy\Request;
use slideshow\Factory\ShowFactory;
use slideshow\View\ShowView;

class Logged extends Base
{
  /**
   * @var slideshow\Factory\ShowFactory
   */
  protected $factory;

  /**
  * @var slideshow\View\ShowView
  */
  protected $view;

  /**
  * Handles the request to render the list page.
  */
  protected function listHtmlCommand(Request $request)
  {
      return $this->view->show();
  }

  protected function listJsonCommand(Request $request)
  {
      return array('listing'=>$this->factory->listing(true));
  }

  /**
  * Handles the request to render the present page.
  */
  protected function presentHtmlCommand(Request $request)
  {
    return $this->view->present();
  }

  protected function presentJsonCommand(Request $request)
  {
    $vars = $request->getRequestVars();
    $id = $vars['id'];
    return array(
      'slides' => $this->factory->getSlides($id),
      'title' => $this->factory->getShowName($id)
    );
  }

}