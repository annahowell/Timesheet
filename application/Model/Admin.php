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
 * This class adds, updates and removes items from the database that relate to admin functions.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
class Admin extends Model
{

    public function addEmployee($username, $password, $firstName, $lastName, $dayRate, $userType, $permanent, $taxID)
    {
        $sql = "INSERT INTO employee (username, password, firstName, lastName, dayRate, userType, permanent, taxID) 
                VALUES (:username, :password, :firstName, :lastName, :dayRate, :userType, :permanent, :taxID)";
        $query = $this->db->prepare($sql);
        $parameters = array(
            ':username' => $username,
            ':password' => $password,
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':dayRate' => $dayRate,
            ':userType' => $userType,
            ':permanent' => $permanent,
            ':taxID' => $taxID
        );

        $query->execute($parameters);
        return $this->db->lastInsertId();
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


    public function getEmployees()
    {
        $sql = "SELECT * FROM employee em JOIN tax_code ta ON em.taxID = ta.taxID";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }


    // --------------------------------------------------------------------


    public function getClients()
    {
        $sql = "SELECT * FROM client";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }


    // --------------------------------------------------------------------


    public function getProjects()
    {
        $sql = "SELECT * FROM project pr JOIN client cl ON pr.clientID = cl.clientID";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }


    // --------------------------------------------------------------------


    public function getTaxCodes()
    {
        $sql = "SELECT * FROM tax_code";
        $query = $this->db->prepare($sql);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //error_log( print_r($result, TRUE) );

        return $result;
    }
}