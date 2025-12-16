import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase-client';
import type { User } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    async initSession(): Promise<void> {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) {
            this.currentUserSubject.next(data.user);
        }
    }

    async signIn(email: string, password: string): Promise<{ error?: string }> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }

        if (data.user) {
            this.currentUserSubject.next(data.user);
        }

        return {};
    }

    async signUp(email: string, password: string): Promise<{ error?: string }> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }

        if (data.user) {
            this.currentUserSubject.next(data.user);
        }

        return {};
    }

    async signOut(): Promise<void> {
        await supabase.auth.signOut();
        this.currentUserSubject.next(null);
    }
    
}
