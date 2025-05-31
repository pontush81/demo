import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, Users, TrendingUp, Building2, Percent } from 'lucide-react'
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
  { value: 'stockholm', label: 'Stockholm', taxRate: 32.08 },
  { value: 'goteborg', label: 'Göteborg', taxRate: 33.42 },
  { value: 'malmo', label: 'Malmö', taxRate: 34.24 },
  { value: 'uppsala', label: 'Uppsala', taxRate: 33.25 },
  { value: 'vasteras', label: 'Västerås', taxRate: 33.25 },
  { value: 'orebro', label: 'Örebro', taxRate: 33.25 },
  { value: 'linkoping', label: 'Linköping', taxRate: 33.25 },
  { value: 'helsingborg', label: 'Helsingborg', taxRate: 33.42 },
  { value: 'jonkoping', label: 'Jönköping', taxRate: 33.25 },
  { value: 'norrkoping', label: 'Norrköping', taxRate: 33.25 }
]

function App() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    monthlySalary: 45000,
    age: 30,
    isChurchMember: false,
    municipality: 'stockholm'
  })
  
  const [results, setResults] = useState<CalculationResults | null>(null)

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
                <Select value={inputs.municipality} onValueChange={(value) => setInputs(prev => ({ ...prev, municipality: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kommun" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((muni) => (
                      <SelectItem key={muni.value} value={muni.value}>
                        {muni.label} ({formatPercentage(muni.taxRate)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
