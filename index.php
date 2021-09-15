<?php

function writeLogs($message) {
    $logs = fopen('php.log', 'a+');
    fwrite($logs, date('d.m.y H:i:s').': '.$message."\n");
    fclose($logs);
}

$start = microtime(true);

if (isset($_GET['xCord']) && isset($_GET['yCord']) && isset($_GET['radius']) && isset($_GET['timeOffset'])) {
    $x = $_GET['xCord'];
    $y = $_GET['yCord'];
    $r = $_GET['radius'];

    if ($x <= 3 && $x >= -5 && $r >= 2 && $r <= 5) {

        $timeOffset = $_GET['timeOffset'];
        $date = date_format(new DateTime("now", new DateTimeZone($timeOffset)), 'd.m.Y H:i:s');

        writeLogs('variables are defined: x: '.$x.', y: '.$y.', radius: '.$r);

        $result = TRUE;

        if ($x > 0) {
            $result = $x <= $r / 2 && $y <= $r && $y >= 0;
        }
        else {
            if ($y >= 0)
                $result = $x * $x + $y * $y <= $r * $r;
            else
                $result = $y >= -$x / 2 - $r / 2;
        }

        writeLogs('result is calcualted');

        $duration = number_format((microtime(true) - $start) * 1000, 4).' мс';
        $result = $result ? 'Да' : 'Нет';

        $toSend = "{\"xCord\": {$x}, \"yCord\": {$y}, \"radius\": {$r}, \"cur_date\": \"{$date}\", \"duration\":
        \"{$duration}\", \"result\": \"{$result}\"}";

        echo $toSend;

        writeLogs('json object is sent to a client');
    }
    else {
        http_response_code(400);
        writeLogs('variables are not valid: x: '.$x.', y: '.$y.', radius: '.$r);
    }
}
else {
    writeLogs('variables are not defined');
}
