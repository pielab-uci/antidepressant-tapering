import {
  PillForm, Drug, OralDosage, OralForm,
} from '../../types';

export const drugNameBrandPairs: { [name: string]: string } = {
  Fluoxetine: 'Prozac',
  Citalopram: 'Celexa',
  Sertraline: 'Zoloft',
  Paroxetine: 'Paxil',
  Escitalopram: 'Lexapro',
};

const drugs: Drug[] = [
  {
    name: 'Fluoxetine',
    halfLife: 'Fluoxetine: 4-6 days\nNorfluoxetine (active metabolite): 4-16 days',
    options:
      [
        {
          brand: 'Fluoxetine (generic)',
          forms: [
            {
              // form: 'bottle of oral solution',
              form: 'oral solution',
              dosages: { bottles: ['120 ml'], rate: { mg: 4, ml: 1 } } as OralDosage,
              measureUnit: 'mg',
            } as OralForm,
            {
              form: 'capsule',
              dosages: [{ dosage: '10 mg' }, { dosage: '20 mg' }, { dosage: '40 mg' }],
              measureUnit: 'mg',
            } as PillForm,
            {
              form: 'tablet',
              dosages: [{ dosage: '10 mg', isScored: true }, { dosage: '20 mg', isScored: true }, { dosage: '60 mg', isScored: true }],
              measureUnit: 'mg',
            } as PillForm,
          ],
        },
        {
          brand: 'Prozac (brand)',
          forms: [
            {
              form: 'capsule',
              dosages: [{ dosage: '10 mg' }, { dosage: '20 mg' }, { dosage: '40 mg' }],
              measureUnit: 'mg',
            } as PillForm,
          ],
        },
      ],
  },
  {
    name: 'Citalopram',
    halfLife: '35 hours',
    options: [
      {
        brand: 'Citalopram (generic)',
        forms: [
          {
            // form: 'ml of oral solution',
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 2 },
              bottles: ['75 ml', '150 ml', '240 ml', '300 ml', '450 ml',
              ],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '10 mg', isScored: false },
              { dosage: '20 mg', isScored: true },
              { dosage: '40 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
      {
        brand: 'Celexa (brand)',
        forms: [
          {
            form: 'tablet',
            dosages: [
              { dosage: '10 mg', isScored: false },
              { dosage: '20 mg', isScored: true },
              { dosage: '40 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
    ],
  },
  {
    name: 'Sertraline',
    halfLife: '24 hours',
    options: [
      {
        brand: 'Sertraline (generic)',
        forms: [
          {
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 20 },
              bottles: ['60 ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '25 mg', isScored: true },
              { dosage: '50 mg', isScored: true },
              { dosage: '100 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
      {
        brand: 'Zoloft (brand)',
        forms: [
          {
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 20 },
              bottles: ['60 ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [{ dosage: '25 mg', isScored: true },
              { dosage: '50 mg', isScored: true },
              { dosage: '100 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
    ],
  }, {
    name: 'Paroxetine',
    halfLife: '21 hours',
    options: [
      {
        brand: 'Paroxetine (generic)',
        forms: [
          {
            form: 'tablet',
            dosages: [
              { dosage: '10 mg', isScored: true },
              { dosage: '20 mg', isScored: true },
              { dosage: '30 mg', isScored: false },
              { dosage: '40 mg', isScored: false }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
      {
        brand: 'Paxil (brand)',
        forms: [
          {
            form: 'oral suspension',
            dosages: {
              rate: { ml: 1, mg: 2 },
              bottles: ['250 ml'],
            },
            measureUnit: 'ml',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '10 mg', isScored: true },
              { dosage: '20 mg', isScored: true },
              { dosage: '30 mg', isScored: false },
              { dosage: '40 mg', isScored: false }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
    ],
  },
  {
    name: 'Escitalopram',
    halfLife: '27-32 hours',
    options: [
      {
        brand: 'Escitalopram (generic)',
        forms: [
          {
            // form: 'ml of oral solution',
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 1 },
              bottles: ['150 ml', '240 ml', '300 ml', '450 ml', '600 ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '5 mg', isScored: false },
              { dosage: '10 mg', isScored: true },
              { dosage: '20 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
      {
        brand: 'Lexapro (brand)',
        forms: [
          {
            form: 'tablet',
            dosages: [
              { dosage: '5 mg', isScored: false },
              { dosage: '10 mg', isScored: true },
              { dosage: '20 mg', isScored: true }],
            measureUnit: 'mg',
          } as PillForm,
        ],
      },
    ],
  },
];

export default drugs;
