<?php
$url = 'https://www.idx.co.id/primary/ListedCompany/GetCompanyProfiles?length=9999';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept: application/json',
    'Origin: https://www.idx.co.id',
    'Referer: https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham/'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
$data = json_decode($response, true);
if (isset($data['data'])) {
    echo "Found " . count($data['data']) . " stocks\n";
    print_r(array_slice($data['data'], 0, 2));
} else {
    echo "Error or no data:\n";
    echo substr($response, 0, 500);
}
