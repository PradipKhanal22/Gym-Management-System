<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class MembershipConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $planName;
    public $amount;
    public $startDate;
    public $endDate;

    public function __construct(User $user, string $planName, float $amount, $startDate, $endDate)
    {
        $this->user = $user;
        $this->planName = $planName;
        $this->amount = $amount;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Membership Activated - ' . $this->planName . ' | NeonFit Gym',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.membership-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
