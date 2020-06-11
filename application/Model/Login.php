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
 * This class adds, updates and removes items from the database for the login function.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
class Login extends Model
{

    public function getPasswordUserType($username)
    {
        $sql = "SELECT password, userType FROM employee WHERE username = :username";
        $query = $this->db->prepare($sql);
        $parameters = array(':username' => $username);

        $query->execute($parameters);

        $result = $query->fetch(PDO::FETCH_ASSOC);
        // error_log( print_r($result['password'].$result['userType'], TRUE) );

        return $result;
    }
}
