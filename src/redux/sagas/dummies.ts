import { Clinician, Patient } from '../../types';

export const sally: Omit<Patient, 'password'> = {
  id: 1,
  name: 'Sally Johnson',
  email: 'sallyj@uci.edu',
  // taperingConfigurations: [
  //   {
  //     id: 1,
  //     clinicianId: 1,
  //     patientId: 1,
  //     createdAt: new Date(),
  //     prescribedDrugs: [
  //       {
  //         name: 'Fluoxetine',
  //         brand: 'Prozac',
  //         form: 'capsule',
  //         currentDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
  //         nextDosages: [{ dosage: '20mg', quantity: 2 }],
  //       },
  //       {
  //         name: 'Citalopram',
  //         brand: 'Celexa',
  //         form: 'tablet',
  //         currentDosages: [{ dosage: '10mg', count: 1 }],
  //         nextDosages: [{ dosage: '20mg', count: 1 }],
  //       },
  //     ],
  //   },
  // ] as TaperingConfiguration[],
  taperingConfiguration: null,
  recentVisit: new Date(),
};

export const john: Omit<Patient, 'password'> = {
  id: 2,
  name: 'John Greenberg',
  email: 'johng@uci.edu',
  // taperingConfigurations: [
  //   {
  //     id: 2,
  //     clinicianId: 1,
  //     patientId: 2,
  //     createdAt: new Date(),
  //     prescribedDrugs: [
  //       {
  //         name: 'Setraline',
  //         brand: 'Zoloft',
  //         form: 'tablet',
  //         currentDosages: [{ dosage: '25mg', quantity: 1 }],
  //         nextDosages: [{ dosage: '10mg', quantity: 1 }],
  //       },
  //     ],
  //   },
  // ] as TaperingConfiguration[],
  // taperingConfiguration: { id: 1 },
  taperingConfiguration: null,
  recentVisit: new Date('2021-05-14T21:13:39.673Z'),
};

export const xiao: Omit<Patient, 'password'> = {
  id: 3,
  email: 'xiaoz@uci.edu',
  name: 'Xiao Zhang',
  // taperingConfigurations: [],
  // taperingConfiguration: { id: 2 },
  taperingConfiguration: null,
  recentVisit: new Date(),
};

export const stephen: Omit<Clinician, 'password'> = {
  email: 'clinician@gmail.com',
  name: 'Stephen Few',
  id: 1,
  patients: [
    { id: sally.id, name: sally.name },
    { id: john.id, name: john.name },
  ],
};
