import { Drug } from '../../types';

const drugs: Drug[] = [
  {
    name: 'Fluoxetine',
    options:
      [
        {
          brand: 'generic (Prozac / Fluoxetine)',
          forms: [
            {
              form: 'bottle of oral solution',
              dosages: [{ dosage: '120ml of 20mg/5ml' }],
              measureUnit: 'ml?',
            },
            {
              form: 'capsule',
              dosages: [{ dosage: '10mg' }, { dosage: '20mg' }, { dosage: '40mg' }],
              measureUnit: 'mg',
            },
            {
              form: 'tablet',
              dosages: [{ dosage: '10mg', isScored: true }, { dosage: '20mg', isScored: true }, { dosage: '60mg', isScored: true }],
              measureUnit: 'mg',

            },
          ],
        },
        {
          brand: 'Prozac',
          forms: [
            {
              form: 'capsule',
              dosages: [{ dosage: '10mg' }, { dosage: '20mg' }, { dosage: '40mg' }],
              measureUnit: 'mg',
            },
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
            form: 'ml of oral solution',
            dosages: [
              { dosage: '75ml (150mg)' },
              { dosage: '150ml (300mg)' },
              { dosage: '240ml (480mg)' },
              { dosage: '300ml (600mg)' },
              { dosage: '450ml (900mg)' }],
            measureUnit: 'ml?',
          },
          {
            form: 'tablet',
            dosages: [
              { dosage: '10mg', isScored: false },
              { dosage: '20mg', isScored: true },
              { dosage: '40mg', isScored: true }],
            measureUnit: 'mg',
          },
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
          },
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
            form: 'bottle of oral solution',
            dosages: [{ dosage: '60ml of 20mg/ml' }],
            measureUnit: 'ml?',
          },
          {
            form: 'tablet',
            dosages: [
              { dosage: '25mg', isScored: true },
              { dosage: '50mg', isScored: true },
              { dosage: '100mg', isScored: true }],
            measureUnit: 'mg',
          },
        ],
      },
      {
        brand: 'Zoloft',
        forms: [
          {
            form: 'bottle of oral solution',
            dosages: [{ dosage: '60ml of 20mg/ml' }],
            measureUnit: 'ml?',
          },
          {
            form: 'tablet',
            dosages: [{ dosage: '25mg', isScored: true },
              { dosage: '50mg', isScored: true },
              { dosage: '100mg', isScored: true }],
            measureUnit: 'mg',
          },
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
          },
        ],
      },
      {
        brand: 'Brisdelle',
        forms: [
          {
            form: 'package',
            dosages: [{ dosage: '30 capsules of 7.5mg' }],
            measureUnit: 'mg?',
          },
        ],
      },
      {
        brand: 'Paxil',
        forms: [
          {
            form: 'bottle of oral suspension',
            dosages: [{ dosage: '250ml of 10mg/5ml' }],
            measureUnit: 'ml?',
          },
          {
            form: 'tablet',
            dosages: [
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true },
              { dosage: '30mg', isScored: false },
              { dosage: '40mg', isScored: false }],
            measureUnit: 'mg',
          },
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
            form: 'ml of oral solution',
            dosages: [
              { dosage: '150ml (150mg)' },
              { dosage: '240ml (240mg)' },
              { dosage: '300ml (300mg)' },
              { dosage: '450ml (450mg)' },
              { dosage: '600ml (600mg)' }],
            measureUnit: 'ml?',
          },
          {
            form: 'tablet',
            dosages: [
              { dosage: '5mg', isScored: false },
              { dosage: '10mg', isScored: true },
              { dosage: '20mg', isScored: true }],
            measureUnit: 'mg',
          },
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
          },
        ],
      },
    ],
  },
];

export default drugs;
