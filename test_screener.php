<?php
$symbols = "BBCA.JK,BBRI.JK,TLKM.JK,BMRI.JK,BBNI.JK,ASII.JK,GOTO.JK,UNVR.JK,ICBP.JK,AMMN.JK,BREN.JK,CUAN.JK";
$url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols={$symbols}";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
$response = curl_exec($ch);
curl_close($ch);
echo substr($response, 0, 500);
