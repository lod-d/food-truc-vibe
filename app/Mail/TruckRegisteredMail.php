<?php

namespace App\Mail;

use App\Models\FoodTruck;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TruckRegisteredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly FoodTruck $truck) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Votre truck \"{$this->truck->name}\" est en ligne sur TruckMap !",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.truck-registered',
        );
    }
}
