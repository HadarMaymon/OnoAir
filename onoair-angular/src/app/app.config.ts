import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes, withComponentInputBinding()),
              provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({ projectId: "onoair-5b966", appId: "1:768114666301:web:4b5d44c5264601c7b73354", storageBucket: "onoair-5b966.firebasestorage.app", apiKey: "AIzaSyAxVhdpy9AgAqDbkobN24o1_6oFnZ3JyOI", authDomain: "onoair-5b966.firebaseapp.com", messagingSenderId: "768114666301", measurementId: "G-TF43DQR4WC" })), provideFirestore(() => getFirestore()),
              ]
};
