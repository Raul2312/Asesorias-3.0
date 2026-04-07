<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ChatbotController extends Controller
{
    public function handleMessage(Request $request)
    {
        $userMessage = $request->input('message');

        try {
            $apiKey = env('GEMINI_API_KEY');

            $client = new Client([
                'verify' => false, 
                'timeout' => 30
            ]);

            // CAMBIO: Usamos gemini-2.0-flash que aparece activo en tu JSON
           $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

            $response = $client->post($url, [
                'query' => ['key' => $apiKey],
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'contents' => [
                        ['parts' => [['text' => $userMessage]]]
                    ],
                    // Añadimos una configuración básica de generación
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 800,
                    ]
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            
            if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                $reply = $data['candidates'][0]['content']['parts'][0]['text'];
            } else {
                $reply = 'La IA no devolvió texto. Respuesta: ' . json_encode($data);
            }

            return response()->json([
                'success' => true,
                'reply' => $reply
            ]);

        } catch (RequestException $e) {
            $responseBody = $e->hasResponse() ? (string)$e->getResponse()->getBody() : $e->getMessage();
            return response()->json([
                'success' => false,
                'error_detail' => $responseBody 
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }
}