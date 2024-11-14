'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Microscope, Calendar, MessageSquare, BookOpen, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from "@/components/ModeToggle"

const features = [
    {
        icon: Calendar,
        title: 'Rezerwacja sprzętu',
        description: 'Łatwo rezerwuj potrzebny sprzęt akademicki na określony czas.'
    },
    {
        icon: MessageSquare,
        title: 'Wsparcie techniczne',
        description: 'Zgłaszaj problemy i uzyskuj pomoc w obsłudze sprzętu.'
    },
    {
        icon: BookOpen,
        title: 'Katalog sprzętu',
        description: 'Przeglądaj pełny katalog dostępnego sprzętu akademickiego.'
    }
]

export default function WelcomeComponent() {
    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <div className="text-center mb-12">
                    <Microscope className="mx-auto h-16 w-16 text-primary" />
                    <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Witaj w AcadEquip
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
                        Twój kompleksowy system wypożyczania sprzętu akademickiego
                    </p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Rozpoczęcie pracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            AcadEquip został zaprojektowany, aby ułatwić proces wypożyczania sprzętu akademickiego.
                            Oto, co możesz zrobić z naszą platformą:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Przeglądaj katalog dostępnego sprzętu</li>
                            <li>Rezerwuj sprzęt na określony czas</li>
                            <li>Uzyskuj wsparcie techniczne w razie potrzeby</li>
                        </ul>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <feature.icon className="h-6 w-6 text-primary mr-2" />
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/login" passHref>
                        <Button size="lg">
                            Przejdź do logowania
                            <KeyRound className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}