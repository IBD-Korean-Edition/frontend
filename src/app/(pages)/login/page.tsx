'use client'

import React, { useState } from 'react';
import * as yup from 'yup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Microscope, LogIn, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from "@/components/ModeToggle";

const loginSchema = yup.object().shape({
    email: yup.string().email('Nieprawidłowy format email').required('Email jest wymagany'),
    password: yup.string().min(8, 'Hasło musi mieć co najmniej 8 znaków').required('Hasło jest wymagane'),
});

const validateLoginData = async (data: { email: string; password: string }) => {
    try {
        await loginSchema.validate(data, { abortEarly: false });
        console.log('Walidacja zakończona sukcesem');
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            console.error('Błędy walidacji:', err.errors);
        }
    }
};

function LoginForm({ userType }: { userType: 'student' | 'employee' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { email, password };
        await validateLoginData(data);

        console.log('Logowanie zakończone sukcesem');
    };

    return (
        <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={userType === 'student' ? 'student@university.edu' : 'employee@university.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                Zaloguj się
                <LogIn className="ml-2 h-4 w-4" />
            </Button>
        </form>
    );
}

export default function LoginPage() {
    const [userType, setUserType] = useState<'student' | 'employee'>('student');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Microscope className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Witamy w AcadEquip</CardTitle>
                        <CardDescription>
                            Akademicki System Wypożyczania Sprzętu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex mb-4">
                            <Button
                                variant={userType === 'student' ? 'default' : 'outline'}
                                className="flex-1 mr-2"
                                onClick={() => setUserType('student')}
                            >
                                <GraduationCap className="mr-2 h-4 w-4" />
                                Student
                            </Button>
                            <Button
                                variant={userType === 'employee' ? 'default' : 'outline'}
                                className="flex-1 ml-2"
                                onClick={() => setUserType('employee')}
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Pracownik
                            </Button>
                        </div>
                        <LoginForm userType={userType} />
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Zapomniałeś hasła?
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}