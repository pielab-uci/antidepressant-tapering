import {
  CapsuleOrTabletForm, Drug, OralDosage, OralForm,
} from '../../types';

const drugs: Drug[] = [
  {
    name: 'Fluoxetine',
    options:
      [
        {
          brand: 'generic (Prozac / Fluoxetine)',
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
          brand: 'Prozac',
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
    options: [
      {
        brand: 'generic (Celexa / Citalopram)',
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
        brand: 'Celexa',
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
    options: [
      {
        brand: 'generic (Zoloft / Sertraline)',
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
        brand: 'Zoloft',
        forms: [
          {
            form: 'oral solution',
            dosages: {
              rate: { ml: 1, mg: 20 },
              bottles: ['60ml'],
            },
            measureUnit: 'ml',
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
    options: [
      {
        brand: 'generic (Brisdelle / Paxil / Paroxetine)',
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
        brand: 'Paxil',
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
    options: [
      {
        brand: 'generic (Lexapro/ Escitalopram)',
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
        brand: 'Lexapro',
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
