const drugs = [
  {
    name: 'Fluoxetine',
    options:
      [
        {
          brand: 'generic',
          forms: [
            {
              form: 'bottle of oral solution',
              dosages: ['120ml of 20mg/5ml'],
            },
            {
              form: 'capsule',
              dosages: ['10mg', '20mg', '40mg'],
            },
            {
              form: 'tablet',
              dosages: ['10mg', '20mg', '60mg'],
            },
            {
              form: 'package',
              dosages: ['4 capsules of 90mg'],
            },
          ],
        },
        {
          brand: 'Prozac',
          forms: [
            {
              form: 'capsule',
              dosages: ['10mg', '20mg', '40mg'],
            },
          ],
        },
      ],
  },
  {
    name: 'Citalopram',
    options: [
      {
        brand: 'generic',
        forms: [
          {
            form: 'ml of oral solution',
            dosages: ['75ml (150mg)', '150ml (300mg)', '240ml (480mg)', '300ml (600mg)', '450ml (900mg)'],
          },
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '40mg'],
          },
        ],
      },
      {
        brand: 'Celexa',
        forms: [
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '40mg'],
          },
        ],
      },
    ],
  },
  {
    name: 'Sertraline',
    options: [
      {
        brand: 'generic',
        forms: [
          {
            form: 'bottle of oral solution',
            dosages: ['60ml of 20mg/ml'],
          },
          {
            form: 'tablet',
            dosages: ['25mg', '50mg', '100mg'],
          },
        ],
      },
      {
        brand: 'Zoloft',
        forms: [
          {
            form: 'bottle of oral solution',
            dosages: ['60ml of 20mg/ml'],
          },
          {
            form: 'tablet',
            dosages: ['25mg', '50mg', '100mg'],
          },
        ],
      },
    ],
  }, {
    name: 'Paroxetine',
    options: [
      {
        brand: 'generic',
        forms: [
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '30mg', '40mg'],
          },
        ],
      },
      {
        brand: 'Brisdelle',
        forms: [
          {
            form: 'package',
            dosages: ['30 capsules of 7.5mg'],
          },
        ],
      },
      {
        brand: 'Paxil',
        forms: [
          {
            form: 'bottle of oral suspension',
            dosages: ['250ml of 10mg/5ml'],
          },
          {
            form: 'tablet',
            dosages: ['10mg', '20mg', '30mg', '40mg'],
          },
        ],
      },
    ],
  },
  {
    name: 'Escitalopram',
    options: [
      {
        brand: 'generic',
        forms: [
          {
            form: 'ml of oral solution',
            dosages: ['150ml (150mg)', '240ml (240mg)', '300ml (300mg)', '450ml (450mg)', '600ml (600mg)'],
          },
          {
            form: 'tablet',
            dosages: ['5mg', '10mg', '20mg'],
          },
        ],
      },
      {
        brand: 'Lexapro',
        forms: [
          {
            form: 'tablet',
            dosages: ['5mg', '10mg', '20mg'],
          },
        ],
      },
    ],
  },
];

export default drugs;
