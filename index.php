<?php

    if(array_key_exists('songs_data', $_POST)){
        $songData = json_decode($_POST['songs_data'], true);
        // foreach($_POST['songs_data'] as $counter=>$songData){
            $fileName = utf8_decode($songData['name']);
            $dloadLink = utf8_decode($songData['link']);
            $dloadFile = 'downloads/'.$fileName.".mp3";
            copy($dloadLink, $dloadFile);
        // }
    }else{
        echo "no";
    }
