// datagenerator.ts

/**
 * Definicje Typów (Interfejsów)
 * Zapewniają bezpieczeństwo typów dla danych randek.
 */

// Definicja wszystkich możliwych kategorii filtrów, które można wybrać
type KategoriaFiltra = 'where' | 'activity' | 'time' | 'budget' | 'season';

// Interfejs opisujący strukturę pojedynczej randki
export interface Randka {
  id: number; // Unikalny identyfikator
  nazwa: string; // Nazwa wyświetlana w aplikacji
  opis: string; // Krótki opis randki
  filtry: {
    // Obiekt, gdzie kluczem jest KategoriaFiltra, a wartością tablica stringów,
    // które ta randka spełnia (np. dla Budżet: ["Duży budżet"])
    [key in KategoriaFiltra]: string[]; 
  };
}

/**
 * Lista Propozycji Randek
 * Główna tablica obiektów z danymi, którą będziesz rozbudowywać.
 */

export const PROPOZYCJE_RANDEK: Randka[] = [
  {
    id: 1,
    nazwa: "Pójście do restauracji na kolację z winem",
    opis: "Klasyczna, elegancka opcja na wieczór. Może Wymagać wcześniejszej rezerwacji.",
    filtry: {
      "where": ["Na zewnątrz"], 
      "activity": ["Leniwie"], 
      "time": ["Mało czasu"],
      "budget": ["Duży budżet"], 
      // Randka pasuje do każdej pory roku (jak zaznaczyłaś)
      "season": ["Dowolna"],
    }
  },
  // -----------------------------------------------------------
  // Randka 2: Wieczór gier planszowych i własnych przekąsek
  // -----------------------------------------------------------
  {
    id: 2, // Zadbaj o unikalne ID
    nazwa: "Wieczór gier planszowych i własnych przekąsek",
    opis: "Idealna opcja na zimny wieczór, sprzyjająca rozmowie i zdrowej rywalizacji. Można połączyć z gotowaniem.",
    filtry: {
      "where": ["W domu"],
      "activity": ["Leniwie"], 
      "time": ["Dużo czasu"], // Gry zwykle trwają dłużej
      "budget": ["Mały budżet"], // Kupno gier jest jednorazowe, same przekąski są tanie
      "season": ["Jesień", "Zima"] // Najlepiej pasuje do chłodniejszych pór
    }
  },
  
  // -----------------------------------------------------------
  // Randka 3: Warsztaty kulinarne lub ceramiczne
  // -----------------------------------------------------------
  {
    id: 3,
    nazwa: "Warsztaty kulinarne/ceramiczne lub inne kreatywne zajęcia",
    opis: "Aktywne spędzanie czasu, podczas którego uczycie się czegoś nowego, a na koniec macie fizyczny efekt pracy.",
    filtry: {
      "where": ["Na zewnątrz"],
      "activity": ["Aktywnie"], 
      "time": ["Mało czasu", "Dużo czasu"], // Zależne od długości warsztatów
      "budget": ["Duży budżet"], // Warsztaty są zazwyczaj drogie
      "season": ["Dowolna"],
    }
  },
  // -----------------------------------------------------------
  // TUTAJ MOŻESZ DODAWAĆ KOLEJNE PROPOZYCJE RANDEK:
  
  /*
  {
    id: X,
    nazwa: "Wypad na rower i piknik w parku",
    opis: "Aktywna randka z możliwością relaksu na kocu.",
    filtry: {
      "where": ["Na zewnątrz"],
      "activity": ["Aktywnie"],
      "time": ["Dużo czasu"],
      "budget": ["Mały budżet", "Duży budżet"],
      "season": ["Wiosna", "Lato", "Jesień"]
    }
  },
  */
  
  // Pamiętaj, żeby zwiększać 'id' dla każdej nowej randki!
];

// Opcjonalnie, możesz wyeksportować wszystkie możliwe opcje filtrów,
// aby użyć ich do budowania interfejsu użytkownika w generator.tsx:

export const OPCJE_FILTROW = {
    where: ["W domu", "Na zewnątrz"],
    activity: ["Leniwie", "Aktywnie"],
    time: ["Mało czasu", "Dużo czasu"],
    budget: ["Mały budżet", "Duży budżet"],
    season: ["Dowolna"],
}