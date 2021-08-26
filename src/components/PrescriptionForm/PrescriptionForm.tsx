import * as React from 'react';
import {
  useEffect, createContext, FC, Dispatch,
} from 'react';
import { useReducer } from 'reinspect';
import Button from 'antd/es/button';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import SelectInterval from './SelectInterval';
import {
  initialState,
  reducer,
  PrescriptionFormReducer,
} from './reducer';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  FETCH_DRUGS,
  priorDosageChange,
  upcomingDosageChange,
  ChooseFormAction,
  ChooseBrandAction,
  FetchDrugsAction,
  LOAD_PRESCRIPTION_DATA, toggleAllowSplittingUnscoredTablet, PrescriptionFormActions, SET_IS_MODAL, DrugFormNames,
} from './actions';
import { IPrescriptionFormContext, PrescriptionFormState } from './types';
import { CapsuleOrTabletDosage, OralDosage, PrescribedDrug } from '../../types';
import {
  CLEAR_SCHEDULE,
  REMOVE_DRUG_FORM,
} from '../../redux/actions/taperConfig';

import { RootState } from '../../redux/reducers';
import { TaperConfigActions, TaperConfigState } from '../../redux/reducers/taperConfig';
import PrescriptionSettingsForm from './PrescriptionSettingsForm';
import Dosages from './Dosages';
import { ModalActions } from '../Schedule/Modal/modalReducer';
import GoalDosageSettingForm from './GoalDosageSettingForm';

export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  modal: { isModal: false },
  Current: {
    dosages: initialState.priorDosagesQty,
  },
  Next: {
    dosages: initialState.upcomingDosagesQty,
  },
  formActionDispatch: () => {
  },
  id: -1,
});

interface Props {
  prescribedDrug: PrescribedDrug;
  title: string;
  numberOfMedications?: number;
  addNewPrescriptionForm?: () => void;
  modal: { isModal: boolean, modalDispatch?: Dispatch<ModalActions> }
}

const PrescriptionForm: FC<Props> = ({
  prescribedDrug,
  title,
  addNewPrescriptionForm,
  numberOfMedications,
  modal: { isModal, modalDispatch },
}) => {
  const taperConfigActionDispatch = useDispatch();
  const [state, formActionDispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, (init) => initialState, `PrescriptionFormReducer_${prescribedDrug.id}`);
  const externalDispatchWrapper = (isModal: boolean) => {
    if (isModal) {
      console.log('modalDispatch');
      return modalDispatch!;
    }
    return taperConfigActionDispatch;
  };

  const {
    chosenBrand, chosenDrugForm, drugFormOptions, dosageOptions,
    priorDosagesQty, upcomingDosagesQty, allowSplittingUnscoredTablet,
    currentDosageForm, nextDosageForm,
  } = state;
  const { drugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  useEffect(() => {
    const action: FetchDrugsAction = {
      type: FETCH_DRUGS,
      data: { drugs, id: prescribedDrug.id },
    };
    formActionDispatch(action);

    formActionDispatch({
      type: SET_IS_MODAL,
      data: { isModal },
    });
    if (prescribedDrug.name !== '') {
      formActionDispatch({ type: LOAD_PRESCRIPTION_DATA, data: prescribedDrug });
    }
  }, []);

  const onBrandChange = (value: string) => {
    const action: ChooseBrandAction = {
      type: CHOOSE_BRAND,
      data: { brand: value, id: prescribedDrug.id },
    };

    formActionDispatch(action);
    // taperConfigActionDispatch(action);
    externalDispatchWrapper(isModal)(action);
  };

  const onFormChange = (value: DrugFormNames) => {
    const chooseFormActionData: ChooseFormAction['data'] = {
      form: value,
      id: prescribedDrug.id,
      minDosageUnit: -1,
      availableDosageOptions: [],
      regularDosageOptions: [],
      oralDosageInfo: null,
    };

    const newChosenDrugForm = drugFormOptions!.find((form) => form.form === value)!;
    if (value === 'capsule' || value === 'tablet') {
      chooseFormActionData.oralDosageInfo = null;
      // TODO: consider if tablet is scored..?
      const minDosage = Math.min(...(newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
        .map((dosage) => parseFloat(dosage.dosage)));
      chooseFormActionData.minDosageUnit = value === 'capsule' ? minDosage : minDosage / 2;
      chooseFormActionData.regularDosageOptions = (newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
        .map((option) => option.dosage);
      chooseFormActionData.availableDosageOptions = [
        ...new Set(
          (newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
            .flatMap((option) => {
              if (option.isScored) {
                return [`${parseFloat(option.dosage) / 2} ${newChosenDrugForm.measureUnit}`, option.dosage];
              }
              return option.dosage;
            }),
        )];
    } else {
      chooseFormActionData.oralDosageInfo = (newChosenDrugForm.dosages as OralDosage);
      chooseFormActionData.minDosageUnit = chooseFormActionData.oralDosageInfo.rate.mg;
      chooseFormActionData.regularDosageOptions = null;
      chooseFormActionData.availableDosageOptions = ['1mg'];
    }

    formActionDispatch({
      type: CHOOSE_FORM,
      data: chooseFormActionData,
    });
    externalDispatchWrapper(isModal)({
      type: CHOOSE_FORM,
      data: chooseFormActionData,
    });
  };

  const removeDrugForm = () => {
    externalDispatchWrapper(isModal)({
      type: REMOVE_DRUG_FORM,
      data: prescribedDrug.id,
    });
    externalDispatchWrapper(isModal)({
      type: CLEAR_SCHEDULE,
    });
  };

  const toggleAllowSplittingUnscoredTabletCheckbox = (e: CheckboxChangeEvent) => {
    formActionDispatch(toggleAllowSplittingUnscoredTablet({ id: prescribedDrug.id, allow: e.target.checked, dosageOptions: (dosageOptions as CapsuleOrTabletDosage[]) }));
    externalDispatchWrapper(isModal)(toggleAllowSplittingUnscoredTablet({
      id: prescribedDrug.id,
      allow: e.target.checked,
      dosageOptions: (dosageOptions as CapsuleOrTabletDosage[]),
    }));
  };

  return (
    <PrescriptionFormContext.Provider value={{
      ...state,
      id: prescribedDrug.id,
      modal: { isModal, modalDispatch },
      Current: {
        dosages: priorDosagesQty,
        dosageChangeAction: priorDosageChange,
      },
      Next: {
        dosages: upcomingDosagesQty,
        dosageChangeAction: upcomingDosageChange,
      },
      formActionDispatch,
    }}
    >
      <div css={css`
        margin-left: 42px;
        padding-bottom: 71px;`}>

        <h2 css={css`font-size: 1.1rem;
          font-weight: bold;
          color: #666666`}>{title}</h2>
        <PrescriptionSettingsForm
          prescribedDrug={prescribedDrug}
          chosenBrand={chosenBrand}
          onBrandChange={onBrandChange}
          chosenDrugForm={chosenDrugForm}
          onFormChange={onFormChange}
          allowSplittingUnscoredTablet={allowSplittingUnscoredTablet}
          toggleAllowSplittingUnscoredTabletCheckbox={toggleAllowSplittingUnscoredTabletCheckbox}/>

        <Dosages drugForm={currentDosageForm} time={'Current'} editable={prescribedDrug.allowChangePriorDosage}/>
        <Dosages drugForm={nextDosageForm} time={'Next'} editable={true}/>
        {/* <Dosages drugForm={chosenDrugForm} time={'Current'} editable={prescribedDrug.allowChangePriorDosage}/> */}
        {/* <Dosages drugForm={prescribedDrug.form} time={'Current'} editable={prescribedDrug.allowChangePriorDosage}/> */}
        {/* <Dosages drugForm={chosenDrugForm && chosenDrugForm.form} time={'Next'} editable={true}/> */}
        {/* <Dosages drugForm={prescribedDrug.form} time={'Current'} editable={prescribedDrug.allowChangePriorDosage}/> */}
        {/* <Dosages drugForm={chosenDrugForm && chosenDrugForm.form} time={'Next'} editable={true}/> */}

        <SelectInterval/>
        <GoalDosageSettingForm/>

        {addNewPrescriptionForm && numberOfMedications && numberOfMedications < 2
        && <Button css={css`border-radius: 10px;
          background-color: #0984E3;
          margin-top: 74px;`} type='primary' onClick={addNewPrescriptionForm}>Add Medication</Button>}

        {numberOfMedications && numberOfMedications > 1
        && <div css={css`display: flex;
          flex-direction: column;
          align-items: flex-end;`}>
          <Button danger
                  css={css`
                    width: 180px;
                    margin-right: 20px;
                    border-radius: 10px;`}
                  onClick={removeDrugForm}>Delete {title}</Button>
          <hr css={css`
            border: none;
            width: 100%;
            height: 3px;
            margin: 18px auto;
            background-color: #D1D1D1;
          `}/>
        </div>}
      </div>
    </PrescriptionFormContext.Provider>
  );
};
export default PrescriptionForm;
