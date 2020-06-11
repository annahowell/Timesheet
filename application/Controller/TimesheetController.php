<?php

namespace Mini\Controller;

use Mini\Model\Timesheet;
use Mini\Model\Admin;

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Timesheet controller
 *
 * This class handles the interaction between the view which handles user choices and the model which adds, updates and
 * removes items from the database.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * and some degree of code repetition.
 *
 */
class TimesheetController
{
    public function index()
    {
        // Instantiate admin class
        $Admin = new Admin();

        // Return list of projects so we can foreach through them to generate the legend
        $projects = $Admin->getProjects();

        // Load our views to construct the page
        require APP . 'view/_templates/header.php';
        require APP . 'view/timesheet/index.php';
        require APP . 'view/_templates/footer.php';
    }


    // --------------------------------------------------------------------


    public function edit_modal($event_id)
    {
        // If we have an event ident
        if (isset($event_id))
        {
            // Instantiate time model
            $Timesheet = new Timesheet();

            // Return what we need for the view to utilise
            $projects = $Timesheet->getProjects();
            $event = $Timesheet->getEvent($event_id);

            require APP . 'view/timesheet/editmodal.php';
        }
        else
        {
            // or error out
            header('location: ' . URL . 'error');
        }
    }


    // --------------------------------------------------------------------


    public function add_modal($starting, $ending)
    {
        if (isset($starting) && isset($ending))
        {
            $start = $starting;
            $end = $ending;

            $Timesheet = new Timesheet();

            $projects = $Timesheet->getProjects();

            require APP . 'view/timesheet/addmodal.php';
        }
        else
        {
            header('location: ' . URL . 'error');
        }
    }


    // --------------------------------------------------------------------


    public function get_events()
    {
        $Timesheet = new Timesheet();
        $result = $Timesheet->getAllEvents();

        $events = array();

        foreach($result as $row)
        {
            $e = new Event();
            $e->id = $row['id'];
            $e->text = $row['name'];
            $e->start = $row['start'];
            $e->end = $row['end'];
            $e->barColor = $Timesheet->getColorCode($row['projectID']);
            //$e->resource = $row['resource_id'];
            $e->bubbleHtml = "Event details: <br/>".$e->text;
            $events[] = $e;
        }

        header('Content-Type: application/json');
        echo json_encode($events);
    }


    // --------------------------------------------------------------------


    public function add_event()
    {
        $Timesheet = new Timesheet();

        $eventId = $Timesheet->addEvent($_POST['start'], $_POST['end'], $_POST['comment'], $_POST['project']);

        $response = new Result();
        $response->status = 'OK';
        $response->message = 'Created with id: '.$eventId;
        $response->id = $eventId;

        header('Content-Type: application/json');
        echo json_encode($response);
    }


    // --------------------------------------------------------------------


    public function delete_event()
    {
        $Timesheet = new Timesheet();

        $eventId = $Timesheet->deleteEvent($_POST['id']);

        $response = new Result();
        $response->status = 'OK';
        $response->message = 'Deleted id: '.$eventId;

        header('Content-Type: application/json');
        echo json_encode($response);
    }


    // --------------------------------------------------------------------


    public function edit_event()
    {
        $Timesheet = new Timesheet();

        $eventId = $Timesheet->editEvent($_POST['comment'], $_POST['project'], $_POST['id']);

        $response = new Result();
        $response->status = 'OK';
        $response->message = 'Changed id: '.$eventId;
        $response->id = $eventId;

        header('Content-Type: application/json');
        echo json_encode($response);
    }


    // --------------------------------------------------------------------


    public function update_event()
    {
        $Timesheet = new Timesheet();

        $Timesheet->updateEvent($_POST['newStart'], $_POST['newEnd'], $_POST['id']);

        $response = new Result();
        $response->status = 'OK';
        $response->message = 'Update successful';

        header('Content-Type: application/json');
        echo json_encode($response);

    }


    // --------------------------------------------------------------------


    public function resize_event()
    {
        $Timesheet = new Timesheet();

        $Timesheet->resizeEvent($_POST['newStart'], $_POST['newEnd'], $_POST['id']);

        $response = new Result();
        $response->status = 'OK';
        $response->message = 'Update successful';

        header('Content-Type: application/json');
        echo json_encode($response);
    }
}

class Event {}

class Result {}
