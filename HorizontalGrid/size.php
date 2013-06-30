<?php

$max = 250;

$preVersion = '';
for ($i = 1; $i <= $max; ++$i) {
    if ($i < 10) {
        $space = '   ';
    } else if ($i < 100) {
        $space = '  ';
    } else {
        $space = ' ';
    }

    $preVersion .= sprintf('.column.size-%1$d%2$s{ .getColumnWidth(%1$d); }', $i, $space) . PHP_EOL;
}
?>

<pre><?php echo $preVersion; ?></pre>