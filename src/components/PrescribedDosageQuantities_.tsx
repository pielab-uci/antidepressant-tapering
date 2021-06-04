// import * as React from 'react';
// import {
//   FC,
//   useCallback,
// } from 'react';
// import { Input } from 'antd';
// import { useDispatch } from 'react-redux';
// import { Dispatch } from 'redux';
// import { TaperConfigActions } from '../redux/reducers/taperConfig';
// import { isCapsuleOrTablet, PrescribedDrug } from '../types';
// import { prescribedQuantityChange } from '../redux/actions/taperConfig';
//
// interface Props {
//   prescribedDrug: PrescribedDrug;
// }
//
// const PrescribedDosageQuantities: FC<Props> = ({ prescribedDrug }) => {
//   const dispatch = useDispatch<Dispatch<TaperConfigActions>>();
//
//   const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const actionData = {
//       dosage: { dosage: e.target.title, quantity: parseFloat(e.target.value) },
//       id: prescribedDrug.id,
//     };
//
//     dispatch(prescribedQuantityChange({
//       ...actionData,
//       intervalDurationDays: prescribedDrug.intervalDurationDays,
//     }));
//   };
//
//   const qtyOrZero = useCallback((prescribedDrug: PrescribedDrug, dosage: string): number => {
//     return prescribedDrug.prescribedDosages[dosage]
//       ? prescribedDrug.prescribedDosages[dosage] * prescribedDrug.intervalDurationDays
//       : 0;
//   }, []);
//
//   const renderOptions = useCallback((options: string[]) => {
//     return (
//       <>
//         {options.map((option) => (
//           <div key={`${prescribedDrug.id}_${option}_${prescribedDrug.prescribedDosages[option]}`}>
//             <h4>{option}:</h4>
//             <Input
//               title={option}
//               style={{ display: 'inline-block' }}
//               type="number"
//               min={0}
//               defaultValue={qtyOrZero(prescribedDrug, option)}
//               value={prescribedDrug.prescribedDosages[option]}
//               step={0.5}
//               width={'50px'}
//               onChange={onCountChange}/>
//           </div>
//         ))}
//       </>
//     );
//   }, [prescribedDrug]);
//
//   const renderQuantities = useCallback(() => {
//     if (prescribedDrug.form === '') {
//       return (<></>);
//     }
//
//     if (isCapsuleOrTablet(prescribedDrug)) {
//       return renderOptions(prescribedDrug.regularDosageOptions!);
//     }
//     return renderOptions(prescribedDrug.oralDosageInfo!.bottles);
//   }, [prescribedDrug]);
//
//   return (
//           <div>
//             <h3>{prescribedDrug.name} ({prescribedDrug.brand}) {prescribedDrug.form}</h3>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//               {renderQuantities()}
//             </div>
//           </div>
//   );
// };
//
// export default PrescribedDosageQuantities;
