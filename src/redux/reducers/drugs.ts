import {
  CapsuleOrTabletForm, Drug, OralDosage, OralForm,
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
              dosages: { bottles: ['120ml'], rate: { mg: 4, ml: 1 } } as OralDosage,
              measureUnit: 'mg',
            } as OralForm,
            {
              form: 'capsule',
              dosages: [{ dosage: '10mg' }, { dosage: '20mg' }, { dosage: '40mg' }],
              measureUnit: 'mg',
            } as CapsuleOrTabletForm,
            {
              form: 'tablet',
              dosages: [{ dosage: '10mg', isScored: true }, { dosage: '20mg', isScored: true }, { dosage: '60mg', isScored: true }],
              measureUnit: 'mg',
            } as CapsuleOrTabletForm,
          ],
        },
        {
          brand: 'Prozac (brand)',
          forms: [
            {
              form: 'capsule',
              dosages: [{ dosage: '10mg' }, { dosage: '20mg' }, { dosage: '40mg' }],
              measureUnit: 'mg',
            } as CapsuleOrTabletForm,
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
              bottles: ['75ml', '150ml', '240ml', '300ml', '450ml',
              ],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '10mg', isScored: false },
              { dosage: '20mg', isScored: true },
              { dosage: '40mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
        ],
      },
      {
        brand: 'Celexa (brand)',
        forms: [
          {
            form: 'tablet',
            dosages: [
              { dosage: '10mg', isScored: false },
              { dosage: '20mg', isScored: true },
              { dosage: '40mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
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
              bottles: ['60ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '25mg', isScored: true },
              { dosage: '50mg', isScored: true },
              { dosage: '100mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
        ],
      },
      {
        brand: 'Zoloft (brand)',
        forms: [
          {
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 20 },
              bottles: ['60ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [{ dosage: '25mg', isScored: true },
              { dosage: '50mg', isScored: true },
              { dosage: '100mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
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
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true },
              { dosage: '30mg', isScored: false },
              { dosage: '40mg', isScored: false }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
        ],
      },
      {
        brand: 'Paxil (brand)',
        forms: [
          {
            form: 'oral suspension',
            dosages: {
              rate: { ml: 1, mg: 2 },
              bottles: ['250ml'],
            },
            measureUnit: 'ml',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true },
              { dosage: '30mg', isScored: false },
              { dosage: '40mg', isScored: false }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
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
              bottles: ['150ml', '240ml', '300ml', '450ml', '600ml'],
            },
            measureUnit: 'mg',
          } as OralForm,
          {
            form: 'tablet',
            dosages: [
              { dosage: '5mg', isScored: false },
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
        ],
      },
      {
        brand: 'Lexapro (brand)',
        forms: [
          {
            form: 'tablet',
            dosages: [
              { dosage: '5mg', isScored: false },
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true }],
            measureUnit: 'mg',
          } as CapsuleOrTabletForm,
        ],
      },
    ],
  },
];

export default drugs;
