<?php

namespace Mini\Model;

use PDO;
use Mini\Core\Model;

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This class adds, updates and removes items from the database.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
class Timesheet extends Model
{

    public function getAllEvents()
    {
        $sql = "SELECT * FROM activity";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }


    // --------------------------------------------------------------------


    public function getEvent($id)
    {
        $sql = "SELECT * FROM activity WHERE id = $id";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetch(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }


    // --------------------------------------------------------------------


    public function addEvent($start, $end, $name, $projectID)
    {
        // Define sql to use
        $sql = "INSERT INTO activity (start, end, name, projectID) VALUES (:start, :end, :name, :projectID)";

        // Prepare it
        $query = $this->db->prepare($sql);
        $parameters = array(':start' => $start, ':end' => $end, ':name' => $name, ':projectID' => $projectID);

        // Execute it
        $query->execute($parameters);
        $id = $this->db->lastInsertId();
        // return the id of the generated item
        return $id;
    }


    // --------------------------------------------------------------------


    public function deleteEvent($id)
    {
        $sql = "DELETE FROM activity WHERE id = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':id' => $id);

        $query->execute($parameters);
    }


    // --------------------------------------------------------------------


    public function editEvent($name, $projectID, $id)
    {
        $sql = "UPDATE activity SET name = :name, projectID = :projectID WHERE id = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':name' => $name, ':projectID' => $projectID, ':id' => $id);

        $query->execute($parameters);
    }


    // --------------------------------------------------------------------


    public function updateEvent($start, $end, $id)
    {
        $sql = "UPDATE activity SET start = :start, end = :end WHERE id = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':start' => $start, ':end' => $end, ':id' => $id);

        $query->execute($parameters);
    }


    // --------------------------------------------------------------------


    public function resizeEvent($start, $end, $id)
    {
        $sql = "UPDATE activity SET start = :start, end = :end WHERE id = :id";
        $query = $this->db->prepare($sql);
        $parameters = array(':start' => $start, ':end' => $end, ':id' => $id);

        $query->execute($parameters);
    }


    // --------------------------------------------------------------------


    public function getProjects()
    {
        $sql = "SELECT * FROM project";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }


    // --------------------------------------------------------------------


    public function getColorCode($projectID)
    {
        $sql = "SELECT projectColour FROM project WHERE projectID = :projectID";
        $query = $this->db->prepare($sql);
        $parameters = array(':projectID' => $projectID);

        $query->execute($parameters);

        $result = $query->fetch(PDO::FETCH_ASSOC);
        // error_log( print_r($result, TRUE) );

        return $result['projectColour'];
    }
}