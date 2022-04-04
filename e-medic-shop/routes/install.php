<?php
/*
|--------------------------------------------------------------------------
| Install Routes
|--------------------------------------------------------------------------
|
| This route is responsible for handling the intallation process
|
|
|
*/
Route::get('/', 'InstallController@step0');


Route::post('/database_installation', 'InstallController@database_installation')->name('install.db');
Route::get('import_sql', 'InstallController@import_sql')->name('import_sql');
Route::post('system_settings', 'InstallController@system_settings')->name('system_settings');
Route::post('purchase_code', 'InstallController@purchase_code')->name('purchase.code');
