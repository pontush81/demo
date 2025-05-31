import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, Users, TrendingUp, Building2, Percent, Search } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import './App.css'

interface CalculationInputs {
  monthlySalary: number
  age: number
  isChurchMember: boolean
  municipality: string
}

interface CalculationResults {
  grossSalary: number
  socialFees: {
    total: number
    breakdown: {
      sjukforsakring: number
      foraldraforsakring: number
      alderspension: number
      efterlevandepension: number
      arbetsmarknad: number
      arbetsskada: number
      allmanLoneavgift: number
    }
  }
  churchTax: number
  stateTax: number
  municipalTax: number
  totalEmployerCost: number
  netSalary: number
  totalTaxRate: number
}

const municipalities = [
  { value: "ale", label: "Ale (32.9%)", name: "Ale", taxRate: 32.85 },
  { value: "alingsas", label: "Alingsås (32.8%)", name: "Alingsås", taxRate: 32.84 },
  { value: "alvesta", label: "Alvesta (33.4%)", name: "Alvesta", taxRate: 33.42 },
  { value: "aneby", label: "Aneby (33.9%)", name: "Aneby", taxRate: 33.85 },
  { value: "arboga", label: "Arboga (33.3%)", name: "Arboga", taxRate: 33.29 },
  { value: "arjeplog", label: "Arjeplog (34.8%)", name: "Arjeplog", taxRate: 34.84 },
  { value: "arvidsjaur", label: "Arvidsjaur (34.1%)", name: "Arvidsjaur", taxRate: 34.14 },
  { value: "arvika", label: "Arvika (34.0%)", name: "Arvika", taxRate: 34.03 },
  { value: "askersund", label: "Askersund (34.2%)", name: "Askersund", taxRate: 34.15 },
  { value: "avesta", label: "Avesta (34.0%)", name: "Avesta", taxRate: 33.95 },
  { value: "bengtsfors", label: "Bengtsfors (34.2%)", name: "Bengtsfors", taxRate: 34.15 },
  { value: "berg", label: "Berg (34.2%)", name: "Berg", taxRate: 34.15 },
  { value: "bjuv", label: "Bjuv (33.4%)", name: "Bjuv", taxRate: 33.42 },
  { value: "boden", label: "Boden (33.8%)", name: "Boden", taxRate: 33.84 },
  { value: "bollebygd", label: "Bollebygd (33.4%)", name: "Bollebygd", taxRate: 33.42 },
  { value: "bollnas", label: "Bollnäs (34.0%)", name: "Bollnäs", taxRate: 33.95 },
  { value: "boras", label: "Borås (33.4%)", name: "Borås", taxRate: 33.42 },
  { value: "borlange", label: "Borlänge (34.0%)", name: "Borlänge", taxRate: 33.95 },
  { value: "botkyrka", label: "Botkyrka (32.1%)", name: "Botkyrka", taxRate: 32.08 },
  { value: "boxholm", label: "Boxholm (33.3%)", name: "Boxholm", taxRate: 33.25 },
  { value: "bromolla", label: "Bromölla (33.4%)", name: "Bromölla", taxRate: 33.42 },
  { value: "bunge", label: "Bunge (32.1%)", name: "Bunge", taxRate: 32.08 },
  { value: "bjorko", label: "Björkö (32.1%)", name: "Björkö", taxRate: 32.08 },
  { value: "dals-ed", label: "Dals-Ed (34.2%)", name: "Dals-Ed", taxRate: 34.15 },
  { value: "danderyd", label: "Danderyd (29.8%)", name: "Danderyd", taxRate: 29.76 },
  { value: "degerfors", label: "Degerfors (33.7%)", name: "Degerfors", taxRate: 33.65 },
  { value: "dorotea", label: "Dorotea (34.8%)", name: "Dorotea", taxRate: 34.84 },
  { value: "eda", label: "Eda (34.0%)", name: "Eda", taxRate: 34.03 },
  { value: "ekerö", label: "Ekerö (32.1%)", name: "Ekerö", taxRate: 32.08 },
  { value: "eksjo", label: "Eksjö (33.3%)", name: "Eksjö", taxRate: 33.25 },
  { value: "emmaboda", label: "Emmaboda (33.4%)", name: "Emmaboda", taxRate: 33.42 },
  { value: "enkoeping", label: "Enköping (33.3%)", name: "Enköping", taxRate: 33.25 },
  { value: "eskilstuna", label: "Eskilstuna (33.3%)", name: "Eskilstuna", taxRate: 33.25 },
  { value: "eslov", label: "Eslöv (33.4%)", name: "Eslöv", taxRate: 33.42 },
  { value: "essunga", label: "Essunga (33.4%)", name: "Essunga", taxRate: 33.42 },
  { value: "fagersta", label: "Fagersta (33.3%)", name: "Fagersta", taxRate: 33.25 },
  { value: "falkenberg", label: "Falkenberg (33.4%)", name: "Falkenberg", taxRate: 33.42 },
  { value: "falkoeping", label: "Falköping (33.4%)", name: "Falköping", taxRate: 33.42 },
  { value: "falun", label: "Falun (34.0%)", name: "Falun", taxRate: 33.95 },
  { value: "filipstad", label: "Filipstad (34.0%)", name: "Filipstad", taxRate: 34.03 },
  { value: "finspang", label: "Finspång (33.3%)", name: "Finspång", taxRate: 33.25 },
  { value: "flen", label: "Flen (33.3%)", name: "Flen", taxRate: 33.25 },
  { value: "forshaga", label: "Forshaga (34.0%)", name: "Forshaga", taxRate: 34.03 },
  { value: "färgelanda", label: "Färgelanda (33.4%)", name: "Färgelanda", taxRate: 33.42 },
  { value: "gagnef", label: "Gagnef (34.0%)", name: "Gagnef", taxRate: 33.95 },
  { value: "gislaved", label: "Gislaved (33.3%)", name: "Gislaved", taxRate: 33.25 },
  { value: "gnesta", label: "Gnesta (33.3%)", name: "Gnesta", taxRate: 33.25 },
  { value: "godland", label: "Godland (32.1%)", name: "Godland", taxRate: 32.08 },
  { value: "goteborg", label: "Göteborg (33.4%)", name: "Göteborg", taxRate: 33.42 },
  { value: "gotland", label: "Gotland (32.1%)", name: "Gotland", taxRate: 32.08 },
  { value: "grankulla", label: "Grankulla (32.1%)", name: "Grankulla", taxRate: 32.08 },
  { value: "grastorp", label: "Grästorp (33.4%)", name: "Grästorp", taxRate: 33.42 },
  { value: "gullspang", label: "Gullspång (33.7%)", name: "Gullspång", taxRate: 33.65 },
  { value: "gallivare", label: "Gällivare (33.8%)", name: "Gällivare", taxRate: 33.84 },
  { value: "gavle", label: "Gävle (34.0%)", name: "Gävle", taxRate: 33.95 },
  { value: "habo", label: "Habo (33.3%)", name: "Habo", taxRate: 33.25 },
  { value: "hadsel", label: "Hadsel (32.1%)", name: "Hadsel", taxRate: 32.08 },
  { value: "hagfors", label: "Hagfors (34.0%)", name: "Hagfors", taxRate: 34.03 },
  { value: "hallsberg", label: "Hallsberg (33.7%)", name: "Hallsberg", taxRate: 33.65 },
  { value: "hallstahammar", label: "Hallstahammar (33.3%)", name: "Hallstahammar", taxRate: 33.25 },
  { value: "halmstad", label: "Halmstad (33.4%)", name: "Halmstad", taxRate: 33.42 },
  { value: "hammarö", label: "Hammarö (34.0%)", name: "Hammarö", taxRate: 34.03 },
  { value: "haninge", label: "Haninge (32.1%)", name: "Haninge", taxRate: 32.08 },
  { value: "haparanda", label: "Haparanda (33.8%)", name: "Haparanda", taxRate: 33.84 },
  { value: "heby", label: "Heby (33.3%)", name: "Heby", taxRate: 33.25 },
  { value: "hedemora", label: "Hedemora (34.0%)", name: "Hedemora", taxRate: 33.95 },
  { value: "helsingborg", label: "Helsingborg (33.4%)", name: "Helsingborg", taxRate: 33.42 },
  { value: "herrljunga", label: "Herrljunga (33.4%)", name: "Herrljunga", taxRate: 33.42 },
  { value: "hjo", label: "Hjo (33.3%)", name: "Hjo", taxRate: 33.25 },
  { value: "hofors", label: "Hofors (34.0%)", name: "Hofors", taxRate: 33.95 },
  { value: "huddinge", label: "Huddinge (32.1%)", name: "Huddinge", taxRate: 32.08 },
  { value: "hudiksvall", label: "Hudiksvall (34.0%)", name: "Hudiksvall", taxRate: 33.95 },
  { value: "hultsfred", label: "Hultsfred (33.4%)", name: "Hultsfred", taxRate: 33.42 },
  { value: "hylte", label: "Hylte (33.4%)", name: "Hylte", taxRate: 33.42 },
  { value: "harjedalen", label: "Härjedalen (34.2%)", name: "Härjedalen", taxRate: 34.15 },
  { value: "harnösand", label: "Härnösand (34.0%)", name: "Härnösand", taxRate: 34.00 },
  { value: "hassleholm", label: "Hässleholm (33.4%)", name: "Hässleholm", taxRate: 33.42 },
  { value: "höganäs", label: "Höganäs (33.4%)", name: "Höganäs", taxRate: 33.42 },
  { value: "hörby", label: "Hörby (33.4%)", name: "Hörby", taxRate: 33.42 },
  { value: "höör", label: "Höör (33.4%)", name: "Höör", taxRate: 33.42 },
  { value: "jokkmokk", label: "Jokkmokk (33.8%)", name: "Jokkmokk", taxRate: 33.84 },
  { value: "jonkoping", label: "Jönköping (33.3%)", name: "Jönköping", taxRate: 33.25 },
  { value: "kalix", label: "Kalix (33.8%)", name: "Kalix", taxRate: 33.84 },
  { value: "kalmar", label: "Kalmar (33.4%)", name: "Kalmar", taxRate: 33.42 },
  { value: "karlsborg", label: "Karlsborg (33.3%)", name: "Karlsborg", taxRate: 33.25 },
  { value: "karlshamn", label: "Karlshamn (33.4%)", name: "Karlshamn", taxRate: 33.42 },
  { value: "karlskoga", label: "Karlskoga (33.7%)", name: "Karlskoga", taxRate: 33.65 },
  { value: "karlskrona", label: "Karlskrona (33.4%)", name: "Karlskrona", taxRate: 33.42 },
  { value: "karlstad", label: "Karlstad (34.0%)", name: "Karlstad", taxRate: 34.03 },
  { value: "katrineholm", label: "Katrineholm (33.3%)", name: "Katrineholm", taxRate: 33.25 },
  { value: "kil", label: "Kil (34.0%)", name: "Kil", taxRate: 34.03 },
  { value: "kinda", label: "Kinda (33.3%)", name: "Kinda", taxRate: 33.25 },
  { value: "kiruna", label: "Kiruna (33.8%)", name: "Kiruna", taxRate: 33.84 },
  { value: "klippan", label: "Klippan (33.4%)", name: "Klippan", taxRate: 33.42 },
  { value: "knivsta", label: "Knivsta (33.3%)", name: "Knivsta", taxRate: 33.25 },
  { value: "kramfors", label: "Kramfors (34.0%)", name: "Kramfors", taxRate: 34.00 },
  { value: "kristianstad", label: "Kristianstad (33.4%)", name: "Kristianstad", taxRate: 33.42 },
  { value: "kristinehamn", label: "Kristinehamn (34.0%)", name: "Kristinehamn", taxRate: 34.03 },
  { value: "krokom", label: "Krokom (33.7%)", name: "Krokom", taxRate: 33.72 },
  { value: "kumla", label: "Kumla (33.7%)", name: "Kumla", taxRate: 33.65 },
  { value: "kungsbacka", label: "Kungsbacka (33.4%)", name: "Kungsbacka", taxRate: 33.42 },
  { value: "kungsör", label: "Kungsör (33.3%)", name: "Kungsör", taxRate: 33.25 },
  { value: "kungälv", label: "Kungälv (33.4%)", name: "Kungälv", taxRate: 33.42 },
  { value: "kävlinge", label: "Kävlinge (33.4%)", name: "Kävlinge", taxRate: 33.42 },
  { value: "köping", label: "Köping (33.3%)", name: "Köping", taxRate: 33.25 },
  { value: "laholm", label: "Laholm (33.4%)", name: "Laholm", taxRate: 33.42 },
  { value: "landskrona", label: "Landskrona (33.4%)", name: "Landskrona", taxRate: 33.42 },
  { value: "laxå", label: "Laxå (33.7%)", name: "Laxå", taxRate: 33.65 },
  { value: "lekeberg", label: "Lekeberg (33.7%)", name: "Lekeberg", taxRate: 33.65 },
  { value: "leksand", label: "Leksand (34.0%)", name: "Leksand", taxRate: 33.95 },
  { value: "lerum", label: "Lerum (33.4%)", name: "Lerum", taxRate: 33.42 },
  { value: "lessebo", label: "Lessebo (33.4%)", name: "Lessebo", taxRate: 33.42 },
  { value: "lidingo", label: "Lidingö (32.1%)", name: "Lidingö", taxRate: 32.08 },
  { value: "lidkoping", label: "Lidköping (33.4%)", name: "Lidköping", taxRate: 33.42 },
  { value: "lilla_edet", label: "Lilla Edet (33.4%)", name: "Lilla Edet", taxRate: 33.42 },
  { value: "lindesberg", label: "Lindesberg (33.7%)", name: "Lindesberg", taxRate: 33.65 },
  { value: "linkoping", label: "Linköping (33.3%)", name: "Linköping", taxRate: 33.25 },
  { value: "ljungby", label: "Ljungby (33.4%)", name: "Ljungby", taxRate: 33.42 },
  { value: "ljusdal", label: "Ljusdal (34.0%)", name: "Ljusdal", taxRate: 33.95 },
  { value: "lund", label: "Lund (33.4%)", name: "Lund", taxRate: 33.42 },
  { value: "lycksele", label: "Lycksele (34.8%)", name: "Lycksele", taxRate: 34.84 },
  { value: "lysekil", label: "Lysekil (33.4%)", name: "Lysekil", taxRate: 33.42 },
  { value: "malmö", label: "Malmö (34.2%)", name: "Malmö", taxRate: 34.24 },
  { value: "malung-salen", label: "Malung-Sälen (34.0%)", name: "Malung-Sälen", taxRate: 33.95 },
  { value: "malå", label: "Malå (34.8%)", name: "Malå", taxRate: 34.84 },
  { value: "mariefred", label: "Mariefred (33.3%)", name: "Mariefred", taxRate: 33.25 },
  { value: "markaryd", label: "Markaryd (33.4%)", name: "Markaryd", taxRate: 33.42 },
  { value: "mark", label: "Mark (33.4%)", name: "Mark", taxRate: 33.42 },
  { value: "mellerud", label: "Mellerud (33.4%)", name: "Mellerud", taxRate: 33.42 },
  { value: "mjolby", label: "Mjölby (33.3%)", name: "Mjölby", taxRate: 33.25 },
  { value: "mora", label: "Mora (34.0%)", name: "Mora", taxRate: 33.95 },
  { value: "motala", label: "Motala (33.3%)", name: "Motala", taxRate: 33.25 },
  { value: "mullsjo", label: "Mullsjö (33.3%)", name: "Mullsjö", taxRate: 33.25 },
  { value: "munkedal", label: "Munkedal (33.4%)", name: "Munkedal", taxRate: 33.42 },
  { value: "munkfors", label: "Munkfors (34.0%)", name: "Munkfors", taxRate: 34.03 },
  { value: "molndal", label: "Mölndal (33.4%)", name: "Mölndal", taxRate: 33.42 },
  { value: "mönsterås", label: "Mönsterås (33.4%)", name: "Mönsterås", taxRate: 33.42 },
  { value: "mörbylanga", label: "Mörbylånga (33.4%)", name: "Mörbylånga", taxRate: 33.42 },
  { value: "nacka", label: "Nacka (32.1%)", name: "Nacka", taxRate: 32.08 },
  { value: "nassjo", label: "Nässjö (33.3%)", name: "Nässjö", taxRate: 33.25 },
  { value: "nordanstig", label: "Nordanstig (34.0%)", name: "Nordanstig", taxRate: 33.95 },
  { value: "nordmaling", label: "Nordmaling (34.8%)", name: "Nordmaling", taxRate: 34.84 },
  { value: "norrkoeping", label: "Norrköping (33.3%)", name: "Norrköping", taxRate: 33.25 },
  { value: "norrtälje", label: "Norrtälje (32.1%)", name: "Norrtälje", taxRate: 32.08 },
  { value: "nykoeping", label: "Nyköping (33.3%)", name: "Nyköping", taxRate: 33.25 },
  { value: "nynashamn", label: "Nynäshamn (32.1%)", name: "Nynäshamn", taxRate: 32.08 },
  { value: "nässjö", label: "Nässjö (33.3%)", name: "Nässjö", taxRate: 33.25 },
  { value: "ockelbo", label: "Ockelbo (34.0%)", name: "Ockelbo", taxRate: 33.95 },
  { value: "olofström", label: "Olofström (33.4%)", name: "Olofström", taxRate: 33.42 },
  { value: "orsa", label: "Orsa (34.0%)", name: "Orsa", taxRate: 33.95 },
  { value: "orust", label: "Orust (33.4%)", name: "Orust", taxRate: 33.42 },
  { value: "osby", label: "Osby (33.4%)", name: "Osby", taxRate: 33.42 },
  { value: "oskarshamn", label: "Oskarshamn (33.4%)", name: "Oskarshamn", taxRate: 33.42 },
  { value: "ovanaker", label: "Ovanåker (34.0%)", name: "Ovanåker", taxRate: 33.95 },
  { value: "oxelosund", label: "Oxelösund (33.3%)", name: "Oxelösund", taxRate: 33.25 },
  { value: "pajala", label: "Pajala (33.8%)", name: "Pajala", taxRate: 33.84 },
  { value: "partille", label: "Partille (33.4%)", name: "Partille", taxRate: 33.42 },
  { value: "perstorp", label: "Perstorp (33.4%)", name: "Perstorp", taxRate: 33.42 },
  { value: "piteå", label: "Piteå (33.8%)", name: "Piteå", taxRate: 33.84 },
  { value: "ragunda", label: "Ragunda (33.7%)", name: "Ragunda", taxRate: 33.72 },
  { value: "rättvik", label: "Rättvik (34.0%)", name: "Rättvik", taxRate: 33.95 },
  { value: "robertsfors", label: "Robertsfors (34.8%)", name: "Robertsfors", taxRate: 34.84 },
  { value: "ronneby", label: "Ronneby (33.4%)", name: "Ronneby", taxRate: 33.42 },
  { value: "rättvik", label: "Rättvik (34.0%)", name: "Rättvik", taxRate: 33.95 },
  { value: "sala", label: "Sala (33.3%)", name: "Sala", taxRate: 33.25 },
  { value: "salem", label: "Salem (32.1%)", name: "Salem", taxRate: 32.08 },
  { value: "sandviken", label: "Sandviken (34.0%)", name: "Sandviken", taxRate: 33.95 },
  { value: "sigtuna", label: "Sigtuna (32.1%)", name: "Sigtuna", taxRate: 32.08 },
  { value: "simrishamn", label: "Simrishamn (33.4%)", name: "Simrishamn", taxRate: 33.42 },
  { value: "sjobo", label: "Sjöbo (33.4%)", name: "Sjöbo", taxRate: 33.42 },
  { value: "skara", label: "Skara (33.4%)", name: "Skara", taxRate: 33.42 },
  { value: "skellefteå", label: "Skellefteå (34.8%)", name: "Skellefteå", taxRate: 34.84 },
  { value: "skinnskatteberg", label: "Skinnskatteberg (33.3%)", name: "Skinnskatteberg", taxRate: 33.25 },
  { value: "skurup", label: "Skurup (33.4%)", name: "Skurup", taxRate: 33.42 },
  { value: "skövde", label: "Skövde (33.4%)", name: "Skövde", taxRate: 33.42 },
  { value: "smedjebacken", label: "Smedjebacken (34.0%)", name: "Smedjebacken", taxRate: 33.95 },
  { value: "sollefteå", label: "Sollefteå (34.0%)", name: "Sollefteå", taxRate: 34.00 },
  { value: "sollentuna", label: "Sollentuna (32.1%)", name: "Sollentuna", taxRate: 32.08 },
  { value: "solna", label: "Solna (32.1%)", name: "Solna", taxRate: 32.08 },
  { value: "sorsele", label: "Sorsele (34.8%)", name: "Sorsele", taxRate: 34.84 },
  { value: "sotenäs", label: "Sotenäs (33.4%)", name: "Sotenäs", taxRate: 33.42 },
  { value: "staffanstorp", label: "Staffanstorp (33.4%)", name: "Staffanstorp", taxRate: 33.42 },
  { value: "stenungsund", label: "Stenungsund (33.4%)", name: "Stenungsund", taxRate: 33.42 },
  { value: "stockholm", label: "Stockholm (32.1%)", name: "Stockholm", taxRate: 32.08 },
  { value: "storfors", label: "Storfors (34.0%)", name: "Storfors", taxRate: 34.03 },
  { value: "storuman", label: "Storuman (34.8%)", name: "Storuman", taxRate: 34.84 },
  { value: "strangnas", label: "Strängnäs (33.3%)", name: "Strängnäs", taxRate: 33.25 },
  { value: "stromstad", label: "Strömstad (33.4%)", name: "Strömstad", taxRate: 33.42 },
  { value: "stromsund", label: "Strömsund (33.7%)", name: "Strömsund", taxRate: 33.72 },
  { value: "sundbyberg", label: "Sundbyberg (32.1%)", name: "Sundbyberg", taxRate: 32.08 },
  { value: "sundsvall", label: "Sundsvall (34.0%)", name: "Sundsvall", taxRate: 34.00 },
  { value: "sunne", label: "Sunne (34.0%)", name: "Sunne", taxRate: 34.03 },
  { value: "surahammar", label: "Surahammar (33.3%)", name: "Surahammar", taxRate: 33.25 },
  { value: "svalöv", label: "Svalöv (33.4%)", name: "Svalöv", taxRate: 33.42 },
  { value: "svedala", label: "Svedala (33.4%)", name: "Svedala", taxRate: 33.42 },
  { value: "svenljunga", label: "Svenljunga (33.4%)", name: "Svenljunga", taxRate: 33.42 },
  { value: "säffle", label: "Säffle (34.0%)", name: "Säffle", taxRate: 34.03 },
  { value: "säter", label: "Säter (34.0%)", name: "Säter", taxRate: 33.95 },
  { value: "sävsjö", label: "Sävsjö (33.3%)", name: "Sävsjö", taxRate: 33.25 },
  { value: "söderhamn", label: "Söderhamn (34.0%)", name: "Söderhamn", taxRate: 33.95 },
  { value: "söderköping", label: "Söderköping (33.3%)", name: "Söderköping", taxRate: 33.25 },
  { value: "södertälje", label: "Södertälje (32.1%)", name: "Södertälje", taxRate: 32.08 },
  { value: "sölvesborg", label: "Sölvesborg (33.4%)", name: "Sölvesborg", taxRate: 33.42 },
  { value: "tanum", label: "Tanum (33.4%)", name: "Tanum", taxRate: 33.42 },
  { value: "tibro", label: "Tibro (33.4%)", name: "Tibro", taxRate: 33.42 },
  { value: "tidaholm", label: "Tidaholm (33.4%)", name: "Tidaholm", taxRate: 33.42 },
  { value: "tierp", label: "Tierp (33.3%)", name: "Tierp", taxRate: 33.25 },
  { value: "timrå", label: "Timrå (34.0%)", name: "Timrå", taxRate: 34.00 },
  { value: "tingsryd", label: "Tingsryd (33.4%)", name: "Tingsryd", taxRate: 33.42 },
  { value: "tjorn", label: "Tjörn (33.4%)", name: "Tjörn", taxRate: 33.42 },
  { value: "tomelilla", label: "Tomelilla (33.4%)", name: "Tomelilla", taxRate: 33.42 },
  { value: "torsby", label: "Torsby (34.0%)", name: "Torsby", taxRate: 34.03 },
  { value: "torsås", label: "Torsås (33.4%)", name: "Torsås", taxRate: 33.42 },
  { value: "tranemo", label: "Tranemo (33.4%)", name: "Tranemo", taxRate: 33.42 },
  { value: "tranås", label: "Tranås (33.3%)", name: "Tranås", taxRate: 33.25 },
  { value: "trelleborg", label: "Trelleborg (33.4%)", name: "Trelleborg", taxRate: 33.42 },
  { value: "trollhattan", label: "Trollhättan (33.4%)", name: "Trollhättan", taxRate: 33.42 },
  { value: "trosa", label: "Trosa (33.3%)", name: "Trosa", taxRate: 33.25 },
  { value: "tyreso", label: "Tyresö (32.1%)", name: "Tyresö", taxRate: 32.08 },
  { value: "täby", label: "Täby (32.1%)", name: "Täby", taxRate: 32.08 },
  { value: "töreboda", label: "Töreboda (33.3%)", name: "Töreboda", taxRate: 33.25 },
  { value: "uddevalla", label: "Uddevalla (33.4%)", name: "Uddevalla", taxRate: 33.42 },
  { value: "ulricehamn", label: "Ulricehamn (33.4%)", name: "Ulricehamn", taxRate: 33.42 },
  { value: "umea", label: "Umeå (34.8%)", name: "Umeå", taxRate: 34.84 },
  { value: "upplands_bro", label: "Upplands Bro (32.1%)", name: "Upplands Bro", taxRate: 32.08 },
  { value: "upplands_vasby", label: "Upplands Väsby (32.1%)", name: "Upplands Väsby", taxRate: 32.08 },
  { value: "uppsala", label: "Uppsala (33.3%)", name: "Uppsala", taxRate: 33.25 },
  { value: "uppvidinge", label: "Uppvidinge (33.4%)", name: "Uppvidinge", taxRate: 33.42 },
  { value: "vadstena", label: "Vadstena (33.3%)", name: "Vadstena", taxRate: 33.25 },
  { value: "vaggeryd", label: "Vaggeryd (33.3%)", name: "Vaggeryd", taxRate: 33.25 },
  { value: "valdemarsvik", label: "Valdemarsvik (33.3%)", name: "Valdemarsvik", taxRate: 33.25 },
  { value: "vallentuna", label: "Vallentuna (32.1%)", name: "Vallentuna", taxRate: 32.08 },
  { value: "vansbro", label: "Vansbro (34.0%)", name: "Vansbro", taxRate: 33.95 },
  { value: "vara", label: "Vara (33.4%)", name: "Vara", taxRate: 33.42 },
  { value: "varberg", label: "Varberg (33.4%)", name: "Varberg", taxRate: 33.42 },
  { value: "varmdo", label: "Värmdö (29.0%)", name: "Värmdö", taxRate: 28.98 },
  { value: "varnamo", label: "Värnamo (33.3%)", name: "Värnamo", taxRate: 33.25 },
  { value: "vasteras", label: "Västerås (33.3%)", name: "Västerås", taxRate: 33.25 },
  { value: "vastervik", label: "Västervik (33.4%)", name: "Västervik", taxRate: 33.42 },
  { value: "vasterviks", label: "Västerviks (33.4%)", name: "Västerviks", taxRate: 33.42 },
  { value: "vaxjo", label: "Växjö (33.4%)", name: "Växjö", taxRate: 33.42 },
  { value: "vellinge", label: "Vellinge (33.4%)", name: "Vellinge", taxRate: 33.42 },
  { value: "vetlanda", label: "Vetlanda (33.3%)", name: "Vetlanda", taxRate: 33.25 },
  { value: "vilhelmina", label: "Vilhelmina (34.8%)", name: "Vilhelmina", taxRate: 34.84 },
  { value: "vimmerby", label: "Vimmerby (33.4%)", name: "Vimmerby", taxRate: 33.42 },
  { value: "vindeln", label: "Vindeln (34.8%)", name: "Vindeln", taxRate: 34.84 },
  { value: "vingaker", label: "Vingåker (33.3%)", name: "Vingåker", taxRate: 33.25 },
  { value: "vårgårda", label: "Vårgårda (33.4%)", name: "Vårgårda", taxRate: 33.42 },
  { value: "vänersborg", label: "Vänersborg (33.4%)", name: "Vänersborg", taxRate: 33.42 },
  { value: "vännäs", label: "Vännäs (34.8%)", name: "Vännäs", taxRate: 34.84 },
  { value: "värmdö", label: "Värmdö (29.0%)", name: "Värmdö", taxRate: 28.98 },
  { value: "ystad", label: "Ystad (33.4%)", name: "Ystad", taxRate: 33.42 },
  { value: "åmål", label: "Åmål (33.4%)", name: "Åmål", taxRate: 33.42 },
  { value: "ånge", label: "Ånge (34.0%)", name: "Ånge", taxRate: 34.00 },
  { value: "åre", label: "Åre (33.7%)", name: "Åre", taxRate: 33.72 },
  { value: "årjäng", label: "Årjäng (34.0%)", name: "Årjäng", taxRate: 34.03 },
  { value: "åsele", label: "Åsele (34.8%)", name: "Åsele", taxRate: 34.84 },
  { value: "åstorp", label: "Åstorp (33.4%)", name: "Åstorp", taxRate: 33.42 },
  { value: "åtvidaberg", label: "Åtvidaberg (33.3%)", name: "Åtvidaberg", taxRate: 33.25 },
  { value: "älmhult", label: "Älmhult (33.4%)", name: "Älmhult", taxRate: 33.42 },
  { value: "älvdalen", label: "Älvdalen (34.0%)", name: "Älvdalen", taxRate: 33.95 },
  { value: "älvkarleby", label: "Älvkarleby (33.3%)", name: "Älvkarleby", taxRate: 33.25 },
  { value: "älvsbyn", label: "Älvsbyn (33.8%)", name: "Älvsbyn", taxRate: 33.84 },
  { value: "ängelholm", label: "Ängelholm (33.4%)", name: "Ängelholm", taxRate: 33.42 },
  { value: "öckerö", label: "Öckerö (33.4%)", name: "Öckerö", taxRate: 33.42 },
  { value: "ödeshög", label: "Ödeshög (34.0%)", name: "Ödeshög", taxRate: 33.95 },
  { value: "örebro", label: "Örebro (33.7%)", name: "Örebro", taxRate: 33.65 },
  { value: "örkelljunga", label: "Örkelljunga (30.2%)", name: "Örkelljunga", taxRate: 30.24 },
  { value: "örnsköldsvik", label: "Örnsköldsvik (34.0%)", name: "Örnsköldsvik", taxRate: 34.00 },
  { value: "östersund", label: "Östersund (33.7%)", name: "Östersund", taxRate: 33.72 },
  { value: "österåker", label: "Österåker (29.0%)", name: "Österåker", taxRate: 28.98 },
  { value: "östhammar", label: "Östhammar (33.4%)", name: "Östhammar", taxRate: 33.35 },
  { value: "östra_göinge", label: "Östra Göinge (32.2%)", name: "Östra Göinge", taxRate: 32.17 },
  { value: "överkalix", label: "Överkalix (34.1%)", name: "Överkalix", taxRate: 34.14 },
  { value: "övertorneå", label: "Övertorneå (33.8%)", name: "Övertorneå", taxRate: 33.84 }
]

function App() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    monthlySalary: 45000,
    age: 30,
    isChurchMember: false,
    municipality: 'stockholm'
  })
  
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [municipalityOpen, setMunicipalityOpen] = useState(false)
  const [municipalitySearch, setMunicipalitySearch] = useState('')

  const calculateEmployeeCosts = () => {
    const { monthlySalary, age, isChurchMember, municipality } = inputs
    
    const municipalityData = municipalities.find(m => m.value === municipality)
    const municipalTaxRate = municipalityData?.taxRate || 32.08

    const socialFeesBreakdown = {
      sjukforsakring: monthlySalary * 0.0355,
      foraldraforsakring: monthlySalary * 0.026,
      alderspension: monthlySalary * 0.1021,
      efterlevandepension: monthlySalary * (age >= 66 ? 0.006 : 0.007),
      arbetsmarknad: monthlySalary * 0.0264,
      arbetsskada: monthlySalary * 0.002,
      allmanLoneavgift: monthlySalary * (age >= 66 ? 0.1062 : 0.1162)
    }

    const totalSocialFees = Object.values(socialFeesBreakdown).reduce((sum, fee) => sum + fee, 0)

    const churchTax = isChurchMember ? monthlySalary * 0.0104 : 0

    const stateIncomeTaxThreshold = age >= 66 ? 733200 : 643100
    const monthlyStateThreshold = stateIncomeTaxThreshold / 12
    const stateTax = monthlySalary > monthlyStateThreshold 
      ? (monthlySalary - monthlyStateThreshold) * 0.20 
      : 0

    const municipalTax = monthlySalary * (municipalTaxRate / 100)

    const totalTaxes = stateTax + municipalTax + churchTax
    const netSalary = monthlySalary - totalTaxes

    const totalEmployerCost = monthlySalary + totalSocialFees

    const totalTaxRate = (totalTaxes / monthlySalary) * 100

    setResults({
      grossSalary: monthlySalary,
      socialFees: {
        total: totalSocialFees,
        breakdown: socialFeesBreakdown
      },
      churchTax,
      stateTax,
      municipalTax,
      totalEmployerCost,
      netSalary,
      totalTaxRate
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Svensk Anställningskostnadskalkylator</h1>
          </div>
          <p className="text-lg text-gray-600">Beräkna den totala kostnaden för att anställa en person i Sverige</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Anställningsuppgifter
              </CardTitle>
              <CardDescription className="text-blue-100">
                Fyll i uppgifter om den anställde
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Månadslön (SEK)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={inputs.monthlySalary || ''}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlySalary: Number(e.target.value) }))}
                  placeholder="45000"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Ålder</Label>
                <Input
                  id="age"
                  type="number"
                  value={inputs.age || ''}
                  onChange={(e) => setInputs(prev => ({ ...prev, age: Number(e.target.value) }))}
                  placeholder="30"
                  min="16"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">Kommun</Label>
                <Popover open={municipalityOpen} onOpenChange={setMunicipalityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={municipalityOpen}
                      className="w-full justify-between"
                    >
                      {inputs.municipality
                        ? municipalities.find((muni) => muni.value === inputs.municipality)?.label
                        : "Välj kommun..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Sök kommun..." 
                        value={municipalitySearch}
                        onValueChange={setMunicipalitySearch}
                      />
                      <CommandEmpty>Ingen kommun hittades.</CommandEmpty>
                      <CommandGroup>
                        <CommandList className="max-h-60">
                          {municipalities
                            .filter((muni) =>
                              muni.name.toLowerCase().includes(municipalitySearch.toLowerCase())
                            )
                            .map((muni) => (
                              <CommandItem
                                key={muni.value}
                                value={muni.value}
                                onSelect={(currentValue) => {
                                  setInputs(prev => ({ ...prev, municipality: currentValue }))
                                  setMunicipalityOpen(false)
                                  setMunicipalitySearch('')
                                }}
                              >
                                {muni.label}
                              </CommandItem>
                            ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="church"
                  checked={inputs.isChurchMember}
                  onCheckedChange={(checked) => setInputs(prev => ({ ...prev, isChurchMember: !!checked }))}
                />
                <Label htmlFor="church">Medlem i Svenska kyrkan</Label>
              </div>

              <Button 
                onClick={calculateEmployeeCosts} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={!inputs.monthlySalary || inputs.monthlySalary <= 0}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Beräkna kostnader
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Kostnadsberäkning
                </CardTitle>
                <CardDescription className="text-yellow-100">
                  Detaljerad uppdelning av alla kostnader
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Bruttolön</div>
                    <div className="text-2xl font-bold text-green-800">{formatCurrency(results.grossSalary)}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Nettolön</div>
                    <div className="text-2xl font-bold text-red-800">{formatCurrency(results.netSalary)}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total arbetsgivarkostnad</div>
                  <div className="text-3xl font-bold text-blue-800">{formatCurrency(results.totalEmployerCost)}</div>
                  <div className="text-sm text-blue-600">per månad</div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Sociala avgifter (Arbetsgivare)
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Total sociala avgifter:</span>
                      <span>{formatCurrency(results.socialFees.total)}</span>
                    </div>
                    <div className="text-sm space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Sjukförsäkring (3,55%):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.sjukforsakring)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Föräldraförsäkring (2,60%):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.foraldraforsakring)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ålderspension (10,21%):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.alderspension)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efterlevandepension ({formatPercentage(inputs.age >= 66 ? 0.6 : 0.7)}):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.efterlevandepension)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arbetsmarknad (2,64%):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.arbetsmarknad)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arbetsskada (0,20%):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.arbetsskada)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allmän löneavgift ({formatPercentage(inputs.age >= 66 ? 10.62 : 11.62)}):</span>
                        <span>{formatCurrency(results.socialFees.breakdown.allmanLoneavgift)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Skatter och avgifter (Anställd)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Kommunalskatt ({formatPercentage(municipalities.find(m => m.value === inputs.municipality)?.taxRate || 32.08)}):</span>
                      <span>{formatCurrency(results.municipalTax)}</span>
                    </div>
                    {results.stateTax > 0 && (
                      <div className="flex justify-between">
                        <span>Statlig inkomstskatt (20%):</span>
                        <span>{formatCurrency(results.stateTax)}</span>
                      </div>
                    )}
                    {results.churchTax > 0 && (
                      <div className="flex justify-between">
                        <span>Kyrkoavgift (1,04%):</span>
                        <span>{formatCurrency(results.churchTax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total skattesats:</span>
                      <span>{formatPercentage(results.totalTaxRate)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-700 font-medium">Årlig kostnad för arbetsgivare</div>
                  <div className="text-2xl font-bold text-yellow-800">{formatCurrency(results.totalEmployerCost * 12)}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Beräkningarna baseras på svenska skattesatser för 2025. Kontakta en skatterådgivare för exakta beräkningar.</p>
        </div>
      </div>
    </div>
  )
}

export default App
