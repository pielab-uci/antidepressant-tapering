import { Drug } from '../../components/PrescriptionForm/types';

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
              dosages: ['120ml of 20mg/5ml'],
              measureUnit: 'ml?',
              isCuttable: true,
            },
            {
              form: 'capsule',
              dosages: ['10mg', '20mg', '40mg'],
              measureUnit: 'mg',
              isCuttable: false,
            },
            {
              form: 'tablet',
              dosages: ['10mg', '20mg', '60mg'],
              measureUnit: 'mg',
              isCuttable: true,

            },
            {
              form: 'package',
              dosages: ['4 capsules of 90mg'],
              measureUnit: '4 capsules...?',
              isCuttable: false,
            },
          ],
        },
        {
          brand: 'Prozac',
          forms: [
            {
              form: 'capsule',
              dosages: ['10mg', '20mg', '40mg'],
              measureUnit: 'mg',
              isCuttable: false,
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
            dosages: ['75ml (150mg)', '150ml (300mg)', '240ml (480mg)', '300ml (600mg)', '450ml (900mg)'],
            measureUnit: 'ml?',
            isCuttable: true,
          },
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '40mg'],
            measureUnit: 'mg',
            isCuttable: true,
          },
        ],
      },
      {
        brand: 'Celexa',
        forms: [
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '40mg'],
            measureUnit: 'mg',
            isCuttable: true,
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
            dosages: ['60ml of 20mg/ml'],
            measureUnit: 'ml?',
            isCuttable: true,
          },
          {
            form: 'tablet',
            dosages: ['25mg', '50mg', '100mg'],
            measureUnit: 'mg',
            isCuttable: true,
          },
        ],
      },
      {
        brand: 'Zoloft',
        forms: [
          {
            form: 'bottle of oral solution',
            dosages: ['60ml of 20mg/ml'],
            measureUnit: 'ml?',
            isCuttable: true,
          },
          {
            form: 'tablet',
            dosages: ['25mg', '50mg', '100mg'],
            measureUnit: 'mg',
            isCuttable: true,
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
            dosages: ['10mg', '20mg', '30mg', '40mg'],
            measureUnit: 'mg',
            isCuttable: true,
          },
        ],
      },
      {
        brand: 'Brisdelle',
        forms: [
          {
            form: 'package',
            dosages: ['30 capsules of 7.5mg'],
            measureUnit: 'mg?',
            isCuttable: true,
          },
        ],
      },
      {
        brand: 'Paxil',
        forms: [
          {
            form: 'bottle of oral suspension',
            dosages: ['250ml of 10mg/5ml'],
            measureUnit: 'ml?',
            isCuttable: true,
          },
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '30mg', '40mg'],
            measureUnit: 'mg',
            isCuttable: true,
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
            dosages: ['150ml (150mg)', '240ml (240mg)', '300ml (300mg)', '450ml (450mg)', '600ml (600mg)'],
            measureUnit: 'ml?',
            isCuttable: true,
          },
          {
            form: 'tablet',
            dosages: ['5mg', '10mg', '20mg'],
            measureUnit: 'mg',
            isCuttable: true,
          },
        ],
      },
      {
        brand: 'Lexapro',
        forms: [
          {
            form: 'tablet',
            dosages: ['5mg', '10mg', '20mg'],
            measureUnit: 'mg',
            isCuttable: true,
          },
        ],
      },
    ],
  },
];

export default drugs;
