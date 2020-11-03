
import { throwError as observableThrowError, Observable, from, BehaviorSubject, Subject, Subscription, AsyncSubject, Observer } from 'rxjs';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
    UserInfo, ProjectSelected, ProjectButtons, ProjectAddress, LandAddress, LandName, LandStreet,
    LandAssessment, LandLocCrossRef, LandLocation, DetailInfo, LandParcel, BuildingPlan,
    BuildingPlanCheck, BuildingFees, BuildingFeeBPSchedule, BuildingInspection, BuildingFeeRate,
    BuildingFeesPlumbing, BuildingFeesElectrical, BuildingFeesMechanical,
    BuildingFeesMFDIF, EncryptedSQLExecution, APNCoordinators,
    BuildingComments, BuildingDST, LandBuilding, LandAPNChange,
    LandComment, LandParking, LandPhoto, PermitTech, STF,
    CompositeObjectUserAndProject, FeesSplitFactors,
    BuildingInspectionsOnSchedule, IOption
} from '../shared/globals';
import { map, filter, scan, catchError, mergeMap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// import { truncate } from 'fs';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Injectable({ providedIn: 'root' })
export class OfflineService {
    private offlineSource = new AsyncSubject();
    offline$ = this.offlineSource.asObservable();
    constructor() {
        try {
            window.addEventListener('online', (event) => this.onChange(event.type));
            window.addEventListener('offline', (event) => this.onChange(event.type));
        } catch (e) {
            // // // // // // // // // // // // // // // // // // // // // // console.log(e);
        }
    }
    onChange(internetconnection: string) {
        return internetconnection;
    }
    setCache = (storagetype: string, storagename: string, value: any, valuetype: string) => {
        const t = valuetype.toLowerCase().trim();
        if (storagetype === 'sessionStorage' || storagetype === 'localStorage') {
            if (typeof (window[storagetype]) !== 'undefined') {
                // reseting forcefuly
                if (typeof (window[storagetype][storagename]) !== 'undefined') {
                    window[storagetype].removeItem(storagename);
                }
                if (t === 'object' || t === 'array') {
                    window[storagetype].setItem(storagename, JSON.stringify(value));
                } else {
                    window[storagetype].setItem(storagename, value);
                }
            } else {
                return false;
            }
        }
    }
    getCache = (storagetype: string, storagename: string, valuetype: string) => {
        const t = valuetype.toLowerCase().trim();
        if (typeof (window[storagetype][storagename]) !== 'undefined') {
            if (t === 'object' || t === 'array') {
                return JSON.parse(window[storagetype][storagename]);
            } else {
                return window[storagetype][storagename];
            }
        } else {
            return false;
        }
    }
    clearCache = (storagetype: string, storagename: string) => {
        if (storagetype === 'sessionStorage' || storagetype === 'localStorage') {
            if (typeof (window[storagetype]) !== 'undefined') {
                // reseting forcefuly
                if (typeof (window[storagetype][storagename]) !== 'undefined') {
                    window[storagetype].removeItem(storagename);
                }
            } else {
                return false;
            }
        }
    }
    clearBuildingSessionObjects() {
        const erasememory = [
            'buildingplans', 'buildingplanschosen', 'buildingplanslist',
            'buildingplancheck', 'buildingplancheckchosen', 'buildingplanchecklist'
        ];
        const t = this;
        erasememory.forEach((e) => {
            t.clearCache('sessionStorage', e);
        });
    }
}
@Injectable({ providedIn: 'root' })
export class DataServices {
    user: UserInfo = {
        id: '',
        fullname: '',
        name: '',
        pass: '',
        division: '',
        pmrights: '',
        brights: '',
        crights: '',
        lrights: '',
        parights: '',
        adm: '',
        internet: '',
        apipoint: '',
        signalrapipoint: '',
        connectionname: '',
        connectionnameland: '',
        connectionnamestaff: '',
        n: '',
        signalrconnectionid: ''
    };
    emptyuser: UserInfo = {
        id: '',
        fullname: '',
        name: '',
        pass: '',
        division: '',
        pmrights: '',
        brights: '',
        crights: '',
        lrights: '',
        parights: '',
        adm: '',
        internet: '',
        apipoint: '',
        signalrapipoint: '',
        connectionname: '',
        connectionnameland: '',
        connectionnamestaff: '',
        n: '',
        signalrconnectionid: ''
    };
    // Initial projects loaded on initiliazing and with each search expanded but at the same time changed in cash
    projectsInfo: ProjectSelected[] = [];
    projectChosen: ProjectSelected = {
        projectCoordinator: '',
        projectCoordinatorOriginal: '',
        projectSearch: '',
        projectNumber: '',
        projectID: '',
        projectExtension: '',
        projectPT: '',
        projectBIN: '',
        projectStreetNumber: '',
        projectStreetDirection: '',
        projectStreetName: '',
        projectStreetType: '',
        projectStreetApt: '',
        projectLocationID: '',
        projectAPN: '',
        projectDescription: '',
        projectPermits: '',
        projectConstructionType: '',
        projectBuildingType: '',
        projectUseType: '',
        projectValue: '',
        projectSprinklerStatus: '',
        projectFloors: '',
        projectOccupancyType2: '',
        projectConstructionType2: '',
        projectUnits: '',
        projectExistingSqFt: '',
        projectNewSqFt: '',
        projectRemodeledSqFt: '',
        projectOwners: '',
        projectApplicantName: '',
        projectContractorName: '',
        projectArchitectName: '',
        projectOccupancyTypePrior: '',
        projectConstructionTypePrior: '',
        projectPayee: '',
        projectAcceptorName: '',
        projectAcceptDate: '',
        projectInspectorName: '',
        projectIssueDate: '',
        projectStatusType: '',
        projectCompleteDate: '',
        projectEstimatedFinalDate: '',
        projectApplicantAddress: '',
        projectContractorAddress: '',
        projectArchitectAddress: '',
        projectApplicantCity: '',
        projectContractorCity: '',
        projectArchitectCity: '',
        projectApplicantState: '',
        projectContractorState: '',
        projectArchitectState: '',
        projectApplicantZip: '',
        projectContractorZip: '',
        projectArchitectZip: '',
        projectApplicantPhone: '',
        projectContractorPhone: '',
        projectArchitectPhone: '',
        projectApplicantEmail: '',
        projectContractorEmail: '',
        projectArchitectEmail: '',
        projectApplicantComments: '',
        projectContractorComments: '',
        projectArchitectComments: '',
        projectApplicantIsContractor: '',
        projectContractorIsContractor: '',
        projectArchitectIsContractor: '',
        projectApplicantLicense: '',
        projectContractorLicense: '',
        projectArchitectLicense: '',
        projectApplicantCType: '',
        projectContractorCType: '',
        projectArchitectCType: '',
        projectApplicantID: '',
        projectContractorID: '',
        projectArchitectID: '',
        projectIDOriginal: '',
        projectExtensionOriginal: '',
        projectPTOriginal: '',
        projectBINOriginal: '',
        projectStreetNumberOriginal: '',
        projectStreetDirectionOriginal: '',
        projectStreetNameOriginal: '',
        projectStreetTypeOriginal: '',
        projectStreetAptOriginal: '',
        projectLocationIDOriginal: '',
        projectAPNOriginal: '',
        projectDescriptionOriginal: '',
        projectPermitsOriginal: '',
        projectConstructionTypeOriginal: '',
        projectBuildingTypeOriginal: '',
        projectUseTypeOriginal: '',
        projectValueOriginal: '',
        projectSprinklerStatusOriginal: '',
        projectFloorsOriginal: '',
        projectOccupancyType2Original: '',
        projectConstructionType2Original: '',
        projectUnitsOriginal: '',
        projectExistingSqFtOriginal: '',
        projectNewSqFtOriginal: '',
        projectRemodeledSqFtOriginal: '',
        projectOwnersOriginal: '',
        projectApplicantNameOriginal: '',
        projectContractorNameOriginal: '',
        projectArchitectNameOriginal: '',
        projectOccupancyTypePriorOriginal: '',
        projectConstructionTypePriorOriginal: '',
        projectPayeeOriginal: '',
        projectAcceptorNameOriginal: '',
        projectAcceptDateOriginal: '',
        projectInspectorNameOriginal: '',
        projectIssueDateOriginal: '',
        projectStatusTypeOriginal: '',
        projectCompleteDateOriginal: '',
        projectEstimatedFinalDateOriginal: '',
        projectApplicantAddressOriginal: '',
        projectContractorAddressOriginal: '',
        projectArchitectAddressOriginal: '',
        projectApplicantCityOriginal: '',
        projectContractorCityOriginal: '',
        projectArchitectCityOriginal: '',
        projectApplicantStateOriginal: '',
        projectContractorStateOriginal: '',
        projectArchitectStateOriginal: '',
        projectApplicantZipOriginal: '',
        projectContractorZipOriginal: '',
        projectArchitectZipOriginal: '',
        projectApplicantPhoneOriginal: '',
        projectContractorPhoneOriginal: '',
        projectArchitectPhoneOriginal: '',
        projectApplicantEmailOriginal: '',
        projectContractorEmailOriginal: '',
        projectArchitectEmailOriginal: '',
        projectApplicantCommentsOriginal: '',
        projectContractorCommentsOriginal: '',
        projectArchitectCommentsOriginal: '',
        projectApplicantIsContractorOriginal: '',
        projectContractorIsContractorOriginal: '',
        projectArchitectIsContractorOriginal: '',
        projectApplicantLicenseOriginal: '',
        projectContractorLicenseOriginal: '',
        projectArchitectLicenseOriginal: '',
        projectApplicantCTypeOriginal: '',
        projectContractorCTypeOriginal: '',
        projectArchitectCTypeOriginal: '',
        projectApplicantIDOriginal: '',
        projectContractorIDOriginal: '',
        projectArchitectIDOriginal: ''
    };
    // The projects fluctuates based on search
    // Based on these data project page is define
    ////////////////////// Erase them later not needed
    projectsInfoSearch: ProjectSelected[] = [];
    projectsSearch: Array<IOption> = [];

    private emptyprojectChosen: ProjectSelected = {
        projectCoordinator: '',
        projectCoordinatorOriginal: '',
        projectSearch: '',
        projectNumber: '',
        projectID: '',
        projectExtension: '',
        projectPT: '',
        projectBIN: '',
        projectStreetNumber: '',
        projectStreetDirection: '',
        projectStreetName: '',
        projectStreetType: '',
        projectStreetApt: '',
        projectLocationID: '',
        projectAPN: '',
        projectDescription: '',
        projectPermits: '',
        projectConstructionType: '',
        projectBuildingType: '',
        projectUseType: '',
        projectValue: '',
        projectSprinklerStatus: '',
        projectFloors: '',
        projectOccupancyType2: '',
        projectConstructionType2: '',
        projectUnits: '',
        projectExistingSqFt: '',
        projectNewSqFt: '',
        projectRemodeledSqFt: '',
        projectOwners: '',
        projectApplicantName: '',
        projectContractorName: '',
        projectArchitectName: '',
        projectOccupancyTypePrior: '',
        projectConstructionTypePrior: '',
        projectPayee: '',
        projectAcceptorName: '',
        projectAcceptDate: '',
        projectInspectorName: '',
        projectIssueDate: '',
        projectStatusType: '',
        projectCompleteDate: '',
        projectEstimatedFinalDate: '',
        projectApplicantAddress: '',
        projectContractorAddress: '',
        projectArchitectAddress: '',
        projectApplicantCity: '',
        projectContractorCity: '',
        projectArchitectCity: '',
        projectApplicantState: '',
        projectContractorState: '',
        projectArchitectState: '',
        projectApplicantZip: '',
        projectContractorZip: '',
        projectArchitectZip: '',
        projectApplicantPhone: '',
        projectContractorPhone: '',
        projectArchitectPhone: '',
        projectApplicantEmail: '',
        projectContractorEmail: '',
        projectArchitectEmail: '',
        projectApplicantComments: '',
        projectContractorComments: '',
        projectArchitectComments: '',
        projectApplicantIsContractor: '',
        projectContractorIsContractor: '',
        projectArchitectIsContractor: '',
        projectApplicantLicense: '',
        projectContractorLicense: '',
        projectArchitectLicense: '',
        projectApplicantCType: '',
        projectContractorCType: '',
        projectArchitectCType: '',
        projectApplicantID: '',
        projectContractorID: '',
        projectArchitectID: '',
        projectIDOriginal: '',
        projectExtensionOriginal: '',
        projectPTOriginal: '',
        projectBINOriginal: '',
        projectStreetNumberOriginal: '',
        projectStreetDirectionOriginal: '',
        projectStreetNameOriginal: '',
        projectStreetTypeOriginal: '',
        projectStreetAptOriginal: '',
        projectLocationIDOriginal: '',
        projectAPNOriginal: '',
        projectDescriptionOriginal: '',
        projectPermitsOriginal: '',
        projectConstructionTypeOriginal: '',
        projectBuildingTypeOriginal: '',
        projectUseTypeOriginal: '',
        projectValueOriginal: '',
        projectSprinklerStatusOriginal: '',
        projectFloorsOriginal: '',
        projectOccupancyType2Original: '',
        projectConstructionType2Original: '',
        projectUnitsOriginal: '',
        projectExistingSqFtOriginal: '',
        projectNewSqFtOriginal: '',
        projectRemodeledSqFtOriginal: '',
        projectOwnersOriginal: '',
        projectApplicantNameOriginal: '',
        projectContractorNameOriginal: '',
        projectArchitectNameOriginal: '',
        projectOccupancyTypePriorOriginal: '',
        projectConstructionTypePriorOriginal: '',
        projectPayeeOriginal: '',
        projectAcceptorNameOriginal: '',
        projectAcceptDateOriginal: '',
        projectInspectorNameOriginal: '',
        projectIssueDateOriginal: '',
        projectStatusTypeOriginal: '',
        projectCompleteDateOriginal: '',
        projectEstimatedFinalDateOriginal: '',
        projectApplicantAddressOriginal: '',
        projectContractorAddressOriginal: '',
        projectArchitectAddressOriginal: '',
        projectApplicantCityOriginal: '',
        projectContractorCityOriginal: '',
        projectArchitectCityOriginal: '',
        projectApplicantStateOriginal: '',
        projectContractorStateOriginal: '',
        projectArchitectStateOriginal: '',
        projectApplicantZipOriginal: '',
        projectContractorZipOriginal: '',
        projectArchitectZipOriginal: '',
        projectApplicantPhoneOriginal: '',
        projectContractorPhoneOriginal: '',
        projectArchitectPhoneOriginal: '',
        projectApplicantEmailOriginal: '',
        projectContractorEmailOriginal: '',
        projectArchitectEmailOriginal: '',
        projectApplicantCommentsOriginal: '',
        projectContractorCommentsOriginal: '',
        projectArchitectCommentsOriginal: '',
        projectApplicantIsContractorOriginal: '',
        projectContractorIsContractorOriginal: '',
        projectArchitectIsContractorOriginal: '',
        projectApplicantLicenseOriginal: '',
        projectContractorLicenseOriginal: '',
        projectArchitectLicenseOriginal: '',
        projectApplicantCTypeOriginal: '',
        projectContractorCTypeOriginal: '',
        projectArchitectCTypeOriginal: '',
        projectApplicantIDOriginal: '',
        projectContractorIDOriginal: '',
        projectArchitectIDOriginal: ''
    };
    projectsInspectors: Array<IOption> = [];
    projectsAcceptros: Array<IOption> = [];
    projectsPermits: Array<IOption> = [];
    projectsFees: Array<IOption> = [];
    projectsStatus: Array<IOption> = [];
    projectsType: Array<IOption> = [];
    projectsBuildingDescr: Array<IOption> = [];
    projectsAddresses: Array<ProjectAddress> = [];
    projectsAPNCoordinators: Array<APNCoordinators> = [];
    projectsCheckerNames: Array<IOption> = [];
    projectsDivision: Array<IOption> = [];
    projectsButtonsRight: Array<ProjectButtons> = [
        // Find
        {
            option: 'Find',
            label: 'Search',
            position: 0,
            enabled: ''
        },
        {
            option: 'Find',
            label: 'Clear',
            position: 1,
            enabled: ''
        },
        {
            option: 'Find',
            label: 'Delete',
            position: 2,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Find',
            label: 'Refresh',
            position: 3,
            enabled: ''
        },
        {
            option: 'Find',
            label: 'Close',
            position: 4,
            enabled: ''
        },
        // Edit-Delete
        {
            option: 'Edit-Delete',
            label: 'Save',
            position: 0,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Edit-Delete',
            label: 'Cancel',
            position: 1,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Edit-Delete',
            label: 'Delete',
            position: 2,
            enabled: ''
        },
        {
            option: 'Edit-Delete',
            label: 'Refresh',
            position: 3,
            enabled: ''
        },
        {
            option: 'Edit-Delete',
            label: 'Close',
            position: 4,
            enabled: ''
        },
        // Edit-Edit
        {
            option: 'Edit-Edit',
            label: 'Save',
            position: 0,
            enabled: ''
        },
        {
            option: 'Edit-Edit',
            label: 'Cancel',
            position: 1,
            enabled: ''
        },
        {
            option: 'Edit-Edit',
            label: 'Delete',
            position: 2,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Edit-Edit',
            label: 'Refresh',
            position: 3,
            enabled: ''
        },
        {
            option: 'Edit-Edit',
            label: 'Close',
            position: 4,
            enabled: ''
        },
        // Add
        {
            option: 'Add',
            label: 'Save',
            position: 0,
            enabled: ''
        },
        {
            option: 'Add',
            label: 'Cancel',
            position: 1,
            enabled: ''
        },
        {
            option: 'Add',
            label: 'Delete',
            position: 2,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Add',
            label: 'Refresh',
            position: 3,
            enabled: 'disabled not-allowed'
        },
        {
            option: 'Add',
            label: 'Close',
            position: 4,
            enabled: 'disabled not-allowed'
        }
    ];
    projectDetailInfoNameOption: Array<string> = ['', '', '', '', ''];
    parcelsAddressType: Array<IOption> = [];
    parcelsAddressName: Array<IOption> = [];
    parcelsAPN: Array<IOption> = [];
    landStreet: Array<IOption> = [];
    landName: Array<IOption> = [];
    landEnvTags: Array<DetailInfo> = [];
    landIdentifier1: Array<DetailInfo> = [];
    landIdentifier2: Array<DetailInfo> = [];
    buildingDST: BuildingDST[] = [];
    landAssessments: LandAssessment[] = [];
    landBuildings: LandBuilding[] = [];
    landComments: LandComment[] = [];
    landParkings: LandParking[] = [];
    landPhotos: LandPhoto[] = [];
    landAPNChanges: LandAPNChange[] = [];
    projectsSTF: STF[] = [];

    private projectsSTFInit = new BehaviorSubject<STF[]>(this.projectsSTF);
    private userInit = new BehaviorSubject<UserInfo>(this.user);
    private projectsInfoInit = new BehaviorSubject<ProjectSelected[]>(this.projectsInfo);
    private projectsInfoSearchInit = new BehaviorSubject<ProjectSelected[]>(this.projectsInfoSearch);
    private projectsSearchInit = new BehaviorSubject<Array<IOption>>(this.projectsSearch);
    private projectChosenInit = new BehaviorSubject<ProjectSelected>(this.projectChosen);
    private projectDetailInfoNameOptionInit = new BehaviorSubject<Array<string>>(this.projectDetailInfoNameOption);
    private projectsInspectorsInit = new BehaviorSubject<IOption[]>(this.projectsInspectors);
    private projectsAcceptorsInit = new BehaviorSubject<IOption[]>(this.projectsAcceptros);
    private projectsStatusInit = new BehaviorSubject<IOption[]>(this.projectsStatus);
    private projectsTypeInit = new BehaviorSubject<IOption[]>(this.projectsType);
    private landStreetInit = new BehaviorSubject<IOption[]>(this.landStreet);
    private landNameInit = new BehaviorSubject<IOption[]>(this.landName);
    private landEnvTagsInit = new BehaviorSubject<DetailInfo[]>(this.landEnvTags);
    private landIdentifier1Init = new BehaviorSubject<DetailInfo[]>(this.landIdentifier1);
    private landIdentifier2Init = new BehaviorSubject<DetailInfo[]>(this.landIdentifier2);
    private projectsAddressesInit = new BehaviorSubject<ProjectAddress[]>(this.projectsAddresses);
    private projectsAPNCoordinatorsInit = new BehaviorSubject<APNCoordinators[]>(this.projectsAPNCoordinators);
    private buildingDSTInit = new BehaviorSubject<BuildingDST[]>(this.buildingDST);
    private landAssessmentsInit = new BehaviorSubject<LandAssessment[]>(this.landAssessments);
    private landBuildingsInit = new BehaviorSubject<LandBuilding[]>(this.landBuildings);
    private landCommentsInit = new BehaviorSubject<LandComment[]>(this.landComments);
    private landParkingsInit = new BehaviorSubject<LandParking[]>(this.landParkings);
    private landPhotosInit = new BehaviorSubject<LandPhoto[]>(this.landPhotos);
    private landAPNChangesInit = new BehaviorSubject<LandAPNChange[]>(this.landAPNChanges);
    currentprojectsSTFInit = this.projectsSTFInit.asObservable();
    currentUser = this.userInit.asObservable();
    currentProjectsInfo = this.projectsInfoInit.asObservable();
    currentProjectsInfoSearch = this.projectsInfoSearchInit.asObservable();
    currentProjectsSearch = this.projectsSearchInit.asObservable();
    currentProjectChosen = this.projectChosenInit.asObservable();
    currentDetailInfoNameOption = this.projectDetailInfoNameOptionInit.asObservable();
    currentLandStreet = this.landStreetInit.asObservable();
    currentLandName = this.landNameInit.asObservable();
    currentLandEnvTags = this.landEnvTagsInit.asObservable();
    currentLandIdentifier1 = this.landIdentifier1Init.asObservable();
    currentLandIdentifier2 = this.landIdentifier2Init.asObservable();
    currentprojectsAddresses = this.projectsAddressesInit.asObservable();
    currentprojectsAPNCoordinators = this.projectsAPNCoordinatorsInit.asObservable();
    currentbuildingDST = this.buildingDSTInit.asObservable();
    currentlandAssessments = this.landAssessmentsInit.asObservable();
    currentlandBuldings = this.landBuildingsInit.asObservable();
    currentlandComments = this.landCommentsInit.asObservable();
    currentlandParkings = this.landParkingsInit.asObservable();
    currentlandPhotos = this.landPhotosInit.asObservable();
    currentlandAPNChanges = this.landAPNChangesInit.asObservable();
    counterProjects = 0;
    private counterProjectsInit = new BehaviorSubject<number>(this.counterProjects);
    currentcounterProjects = this.counterProjectsInit.asObservable();
    projectFeesSplitFactors: Array<FeesSplitFactors> = [];
    private FeesSplitFactorsInit = new BehaviorSubject<FeesSplitFactors[]>(this.projectFeesSplitFactors);
    currentprojectFeesSplitFactors = this.FeesSplitFactorsInit.asObservable();

    resetCounterProjects() {
        this.counterProjects = 0;
        this.counterProjectsInit.next(this.counterProjects);
    }
    countCounterProjects(n: number) {
        this.counterProjects = n;
        this.counterProjectsInit.next(this.counterProjects);
    }
    constructor(@Optional() @SkipSelf() parentModule: DataServices, private os: OfflineService
    ) {
        // if (parentModule) {
        //     throw new Error(
        //         'CoreModule is already loaded. Import it in the AppModule only');
        // }
    }
    changeCurrentUser(user: UserInfo) {
        this.user = user;
        this.userInit.next(user);
    }
    fillProjectsInfo(projects: ProjectSelected[]) {
        this.projectsInfo = projects;
        this.projectChosen = this.projectsInfo[0];
        this.projectsInfoInit.next(projects);
        this.projectChosenInit.next(this.projectChosen);
    }
    fillProjectsInfoSearch(projects: ProjectSelected[]) {
        this.projectsInfoSearch = projects;
        this.projectChosen = this.projectsInfo[0];
        this.projectsInfoSearchInit.next(projects);
        this.projectChosenInit.next(this.projectChosen);
    }
    fillProjectChosen(project: ProjectSelected) {
        this.projectChosen = JSON.parse(JSON.stringify(project));
        this.os.setCache('localStorage', 'project', this.projectChosen, 'object');
        this.projectChosenInit.next(project);
    }
    fillProjectsSearch(projects: IOption[]) {
        this.projectsSearch = projects;
        this.projectsSearchInit.next(projects);
    }
    fillProjectsAddtlInfo(projects: IOption[], option: string, modulestr: string) {
        this[modulestr + option] = projects;
        try {
            if (typeof this[modulestr + option + 'Init'] !== 'undefined') {
                this[modulestr + option + 'Init']['next'](projects);
            }
        } catch (err) {
            // // // // // // // // // // // // // // // console.log([projects, option, modulestr]);
            // // // // // // // // // // // // // // // console.log(err);
        }
    }
    fillProjectsAddtlInfoDetail(projects: DetailInfo[], option: string, modulestr: string) {
        this[modulestr + option] = projects;
        try {
            if (typeof this[modulestr + option + 'Init'] !== 'undefined') {
                this[modulestr + option + 'Init']['next'](projects);
            }
        } catch (err) {
            // // // // // // // // // // // // // // // console.log([projects, option, modulestr]);
            // // // // // // // // // // // // // // // console.log(err);
        }
    }
    fillProjectsAddresses(addresses: ProjectAddress[]) {
        this.projectsAddresses = addresses;
        this.projectsAddressesInit.next(addresses);
    }
    fillProjectsAPNCoordinators(apncoords: APNCoordinators[]) {
        this.projectsAPNCoordinators = apncoords;
        this.projectsAPNCoordinatorsInit.next(apncoords);
    }
    fillDetailInfoNameOption(details: string[]) {
        this.projectDetailInfoNameOption = details;
        // // // // // // // // // // // // // // // // // // // // // console.log('relaying');
        // // // // // // // // // // // // // // // // // // // // // console.log(details);

        this.projectDetailInfoNameOptionInit.next(this.projectDetailInfoNameOption);
    }
    fillObservableObjects(keyname: string, arrobj: string) {
        const testing_var = 'buildingFees';

        this[keyname] = JSON.parse(arrobj);
        if (typeof this[keyname + 'Init'] !== 'undefined') {
            this[keyname + 'Init'].next(this[keyname]);
        } else {
            // // // // // // // // // // // // console.log('???????????????????');
            // // // // // // // // // // // // console.log(keyname);
            // // // // // // // // // // // // console.log(this[keyname]);
            // // // // // // // // // // // // console.log(this[keyname + 'Init']);
        }
        if (testing_var === keyname) {
            // // // // // // // // // // console.log('???????????????????');
            // // // // // // // // // // console.log(keyname);
            // // // // // // // // // // console.log(this[keyname]);
            // // // // // // // // // // console.log(this[keyname + 'Init']);
        }
    }
    getObservableObjects(keyname: string): string {
        return JSON.stringify(this[keyname]);
    }
    /////////////////////////////////////////////
    eraseProjectsInfo() {
        this.projectsInfo = [];
        this.projectsInfoInit.next(this.projectsInfo);
    }
    eraseProjectsInfoSearch() {
        this.projectsInfoSearch = [];
        this.projectsInfoSearchInit.next(this.projectsInfoSearch);
    }
    eraseProjectChosen() {
        this.projectChosen = JSON.parse(JSON.stringify(this.emptyprojectChosen));
        this.projectChosenInit.next(this.projectChosen);
    }
    eraseUser() {
        this.user = this.emptyuser;
        this.userInit.next(this.user);
    }
    eraseProjectsSearch() {
        this.projectsSearch = [];
        this.projectsSearchInit.next(this.projectsSearch);
    }
    eraseProjectsAddtlInfo(option: string, modulestr: string) {
        this[modulestr + option] = [];
    }
    addProjectsInfo(project: ProjectSelected) {
        this.projectsInfo.unshift(project);
        this.projectsInfoInit.next(this.projectsInfo);
    }
    addProjectsSearch(project: IOption) {
        this.projectsSearch.unshift(project);
        this.projectsSearchInit.next(this.projectsSearch);
    }
    addProjectsAddtlInfo(project: IOption[], option: string, modulestr: string) {
        this[modulestr + option].push(project);
    }
    addProjectsAddtlInfoDetail(project: DetailInfo, option: string, modulestr: string) {
        this[modulestr + option].push(project);
    }
    getCurrentUser() {
        return this.user;
    }
    getProjectsInfo() {
        return this.projectsInfo;
    }
    getProjectsInfoCount() {
        return this.projectsInfo.length;
    }
    getProjectsInfoSearch() {
        return this.projectsInfoSearch;
    }
    getProjectChosen(): ProjectSelected {
        // const x: ProjectSelected = this.os.getCache('localStorage', 'project', 'object');
        // return x;
        return this.projectChosen;
    }
    getProjectsSearch() {
        return this.projectsSearch;
    }
    getProjectsAddtlInfo(option: string, modulestr: string): Array<IOption> {
        return this[modulestr + option];
    }
    getProjectsAddtlInfoDetail(option: string, modulestr: string): Array<DetailInfo> {
        return this[modulestr + option];
    }
    getProjectsAddresses(): Array<ProjectAddress> {
        return this.projectsAddresses;
    }
    getProjectsAPNCoordinators(): Array<APNCoordinators> {
        return this.projectsAPNCoordinators;
    }
    getProjectsButtonsRight(): Array<ProjectButtons> {
        return this.projectsButtonsRight;
    }
    getProjectsButtonsRightInfo(option: string): Array<ProjectButtons> {
        return this.projectsButtonsRight.filter(el =>
            el.option === option
        );
    }
    changeProjectChosen(propertyname: string, value: string, p: ProjectSelected) {
        this.projectChosen = p;
        p[propertyname] = value;
        this.projectChosenInit.next(p);
    }
    downloadFilesObservable = (fullpaths: string[], env: string, files_extensions: string[]): Observable<any> => {
        return new Observable((observer: any) => {
            observer.next(
                ((f, e) => {
                    function download_next(i) {
                        if (i >= f.length) {
                            return 'done';
                        } else {
                            const filename = f[i].slice(f[i].lastIndexOf('\\') + 1);
                            const file_extension = filename.slice(filename.lastIndexOf('.') + 1);
                            const filenamefullpath = e + filename;
                            if (files_extensions.includes(file_extension)) {
                                const a = document.createElement('a');
                                a.href = filenamefullpath;
                                a.target = '_parent';
                                // Use a.download if available, it prevents plugins from opening.
                                if ('download' in a) {
                                    a.download = filename;
                                }
                                // Add a to the doc for click to work.
                                (document.body || document.documentElement).appendChild(a);
                                if (a.click) {
                                    a.click(); // The click method is supported by most browsers.
                                }
                                // Delete the temporary link.
                                a.parentNode.removeChild(a);
                                // Download the next file with a small timeout. The timeout is necessary
                                // for IE, which will otherwise only download the first file.
                                setTimeout(() => {
                                    download_next(i + 1);
                                    // return a;
                                }, 1500);
                            }
                        }
                    }
                    // Initiate the first download.
                    download_next(0);
                })(fullpaths, env)
            );
        });
    }
    download_files(files, env) {
        function download_next(i) {
            if (i >= files.length) {
                return;
            }
            const a = document.createElement('a');
            const filename = files[i].slice(files[i].lastIndexOf('\\') + 1);
            const filenamefullpath: string = env + filename;
            a.href = filenamefullpath;
            a.target = '_parent';
            // Use a.download if available, it prevents plugins from opening.
            if ('download' in a) {
                a.download = filename;
            }
            // Add a to the doc for click to work.
            (document.body || document.documentElement).appendChild(a);
            if (a.click) {
                a.click(); // The click method is supported by most browsers.
            }
            // Delete the temporary link.
            a.parentNode.removeChild(a);
            // Download the next file with a small timeout. The timeout is necessary
            // for IE, which will otherwise only download the first file.
            setTimeout(() => {
                download_next(i + 1);
            }, 500);
        }
        // Initiate the first download.
        download_next(0);
    }
    getDateFromString(date: string): Date {
        return new Date(+date.slice(6, 10), +date.slice(0, 2) - 1, +date.slice(3, 5));
    }
    getStringDateFromDateInput(date: string): string {
        return date.slice(5, 7) + '/' + date.slice(8, 10) + '/' + date.slice(0, 4);
    }
    removeProject(pid: string) {
        if (pid.length > 0) {
            const projects = this.getProjectsInfo();
            const ri = projects.map(item => item.projectID).indexOf(pid);
            projects.splice(ri, 1);
            this.projectsInfoInit.next(projects);
            const arrProjectSearch: IOption[] = [];
            this.eraseProjectsSearch();
            let i = 0;
            projects.map(x => {
                const psd: IOption = {
                    label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                        + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
                    value: i.toString()
                };
                i++;
                arrProjectSearch.push(psd);
            });
            this.fillProjectsSearch(arrProjectSearch);
            this.countCounterProjects(projects.length);
        }
    }
    addProject(pid: ProjectSelected) {
        const projects = this.getProjectsInfo();
        const ri = projects.push(pid);
        this.projectsInfoInit.next(projects);
        const arrProjectSearch: IOption[] = [];
        this.eraseProjectsSearch();
        let i = 0;
        projects.map(x => {
            const psd: IOption = {
                label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                    + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
                value: i.toString()
            };
            i++;
            arrProjectSearch.push(psd);
        });
        this.fillProjectsSearch(arrProjectSearch);
        this.countCounterProjects(projects.length);
    }
    restoreAllProjects(atr: string[]): Observable<any> {
        const observable = from(this.getProjectsInfo());
        observable.subscribe(project => {
            atr.map(a => {
                if (a !== 'projectNumber') {
                    project[a] = project[a + 'Original'];
                }
            });
        });
        return observable;
    }
    displayForm(s: string): boolean {
        if (typeof s !== 'undefined') {
            if (s === 'true') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    checkIfAddressIsReal(streetnumber: string, streetdirection: string,
        streetname: string, streettype: string, streetapt: string,
        addresses: ProjectAddress[]): boolean {
        // // // // // // console.log('-------------- Checking Address if real below!');
        // // // // // // console.log(addresses);
        let x1 = addresses;
        if (streetname.length > 0) {
            x1 = addresses.filter(a => a.projectName.toLocaleLowerCase().trim() === streetname.toLocaleLowerCase().trim());
        }
        // // // // // // console.log(x1);
        let x2 = x1;
        if (streetnumber.length > 0) {
            x2 = x1.filter(a => a.projectNumber.toLocaleLowerCase().trim() === streetnumber.toLocaleLowerCase().trim());
        }
        // // // // // // console.log(x2);
        let x3 = x2;
        if (streetdirection.length > 0) {
            x3 = x2.filter(a => a.projectDirection.toLocaleLowerCase().trim() === streetdirection.toLocaleLowerCase().trim());
        }
        // // // // // // console.log(x3);
        let x4 = x3;
        if (streetapt.length > 0) {
            x4 = x3.filter(a => a.projectApt.toLocaleLowerCase().trim() === streetapt.toLocaleLowerCase().trim());
        }
        // // // // // // console.log(x4);
        let x5 = x4;
        if (streettype.length > 0) {
            x5 = x4.filter(a => a.projectType.toLocaleLowerCase().trim() === streettype.toLocaleLowerCase().trim());
        }
        // // // // // // console.log(x5);
        // // // // // // console.log('-------------- Checking Address if real below ENDED!');
        if (typeof x5 !== 'undefined' && x5.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    derivedAPNFromAddresses(streetnumber: string, streetdirection: string,
        streetname: string, streettype: string, streetapt: string,
        addresses: ProjectAddress[]): string {
        let x1 = addresses;
        if (streetname.length > 0) {
            x1 = addresses.filter(a => a.projectName.toLocaleLowerCase().trim() === streetname.toLocaleLowerCase().trim());
        }
        let x2 = x1;
        if (streetnumber.length > 0) {
            x2 = x1.filter(a => a.projectNumber.toLocaleLowerCase().trim() === streetnumber.toLocaleLowerCase().trim());
        }
        let x3 = x2;
        if (streetdirection.length > 0) {
            x3 = x2.filter(a => a.projectDirection.toLocaleLowerCase().trim() === streetdirection.toLocaleLowerCase().trim());
        }
        let x4 = x3;
        if (streetapt.length > 0) {
            x4 = x3.filter(a => a.projectApt.toLocaleLowerCase().trim() === streetapt.toLocaleLowerCase().trim());
        }
        let x5 = x4;
        if (streettype.length > 0) {
            x5 = x4.filter(a => a.projectType.toLocaleLowerCase().trim() === streettype.toLocaleLowerCase().trim());
        }
        if (typeof x5 !== 'undefined' && x5.length > 0) {
            return x5[0].projectAPN;
        } else {
            return 'f';
        }
    }
    checkIfAPNIsReal(apn: string): boolean {
        const arr = this.getProjectsAddtlInfo('APN', 'parcels');
        const x = arr.find(v => v.label === apn);
        if (typeof x !== 'undefined') {
            return true;
        } else {
            return false;
        }
    }
    addJSONToExistingProjects(x: ProjectSelected) {
        let to_import = true;
        const psd: IOption = {
            label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
            value: this.projectsInfo.length.toString()
        };
        const pd: ProjectSelected = this.convertProjectCoveringOriginal(x);
        if (this.projectsInfo.some(e => e.projectID === pd.projectID)) {
            to_import = false;
        }
        if (to_import) {
            // // // // // // // // // // // // // // // // // // // // console.log('Adding psd');
            // // // // // // // // // // // // // // // // // // // // console.log(psd);
            this.addProjectsInfo(pd);
            this.addProjectsSearch(psd);
            this.countCounterProjects(this.projectsInfo.length);
        }
    }
    replaceProjectFromJSON(r: string) {
        const x = this.convertJSONToProject(JSON.parse(r)[0]);
        this.removeProject(x.projectID);
        const pd: ProjectSelected = this.convertProjectCoveringOriginal(x);
        this.addProjectsInfo(pd);
        const psd: IOption = {
            label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
            value: this.projectsInfo.length.toString()
        };
        this.addProjectsSearch(psd);
        this.countCounterProjects(this.projectsInfo.length);
    }
    convertJSONToProject(x: ProjectSelected): ProjectSelected {
        return this.convertProjectCoveringOriginal(x);
    }
    addToDropDownList(opts: IOption[], value: string): IOption[] {
        if (typeof (opts) !== 'undefined') {
            const r = opts;
            const addtoa: IOption = {
                label: value,
                value: opts.length.toString()
            };
            r.push({
                label: value,
                value: opts.length.toString()
            });
            return r;
        } else {
            const rr: IOption[] = [];
            const addtoaa: IOption = {
                label: value,
                value: '0'
            };
            rr.push(addtoaa);
            return rr;
        }
    }
    addToDropDownListStart(opts: IOption[], value: string): IOption[] {
        if (typeof (opts) !== 'undefined') {
            const r = opts;
            const addtoa: IOption = {
                label: value,
                value: opts.length.toString()
            };
            r.unshift({
                label: value,
                value: opts.length.toString()
            });
            return r;
        } else {
            const rr: IOption[] = [];
            const addtoaa: IOption = {
                label: value,
                value: '0'
            };
            rr.unshift(addtoaa);
            return rr;
        }
    }
    deleteFromDropDownList(opts: IOption[], value: string): IOption[] {
        const x: IOption[] = [];
        if (typeof (opts) !== 'undefined') {
            return opts.filter(e => e.label !== value);
        } else {
            return x;
        }
    }
    editWithinDropDownList(opts: IOption[], oldvalue: string,
        newvalue: string): IOption[] {
        const r = opts;
        r[opts.findIndex(x => x.label === oldvalue)].label = newvalue;
        return r;
    }
    deleteFromArrayOfObjects(opts: Object[], obj: Object): string {
        return JSON.stringify(opts.filter((x) => x !== obj));
    }
    getMachineName(fn: string): string {
        let r = '';
        // // // // // // // // // // // // // // // // // // // console.log(this.projectsSTF);
        try {
            r = this.projectsSTF.filter(x => x.fullname.trim().toLocaleLowerCase().replace(' ', '')
                === fn.trim().toLocaleLowerCase().replace(' ', ''))[0].name;

        } catch (err) {
            r = fn;
        }
        return r;
    }
    getFullName(mn: string): string {
        let r = '';
        try {
            r = this.projectsSTF.filter(x => x.name.trim().toLocaleLowerCase().replace(' ', '')
                === mn.trim().toLocaleLowerCase().replace(' ', ''))[0].fullname;
        } catch (err) {
            r = mn;
        }
        return r;
    }
    convertListFullNamesToMachineNames(inputarr: Array<IOption>): Array<IOption> {
        const xarr = inputarr.map(x => {
            // // // // // // // // // // // // // // // // console.log(x.label);
            // // // // // // // // // // // // // // // // console.log(this.getMachineName(x.label));
            if (this.getMachineName(x.label).length > 0) {
                x.label = this.getMachineName(x.label);
            }
            return x;
        });
        return JSON.parse(JSON.stringify(xarr));
    }
    getEmptyProject(): ProjectSelected {
        return JSON.parse(JSON.stringify(this.emptyprojectChosen));
    }
    convertProjectCoveringOriginal(x: ProjectSelected): ProjectSelected {
        const pd: ProjectSelected = JSON.parse(JSON.stringify(x));
        pd.projectCoordinatorOriginal = x.projectCoordinator;
        pd.projectSearch = x.projectSearch.toString();
        pd.projectNumber = x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
            + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName;
        pd.projectIDOriginal = x.projectID;
        pd.projectExtensionOriginal = x.projectExtension;
        pd.projectPTOriginal = x.projectPT;
        pd.projectBINOriginal = x.projectBIN;
        pd.projectStreetNumberOriginal = x.projectStreetNumber;
        pd.projectStreetDirectionOriginal = x.projectStreetDirection;
        pd.projectStreetNameOriginal = x.projectStreetName;
        pd.projectStreetTypeOriginal = x.projectStreetType;
        pd.projectStreetAptOriginal = x.projectStreetApt;
        pd.projectLocationIDOriginal = x.projectLocationID;
        pd.projectAPNOriginal = x.projectAPN;
        pd.projectDescriptionOriginal = x.projectDescription;
        pd.projectPermitsOriginal = x.projectPermits;
        pd.projectConstructionTypeOriginal = x.projectConstructionType;
        pd.projectBuildingTypeOriginal = x.projectBuildingType;
        pd.projectUseTypeOriginal = x.projectUseType;
        pd.projectValueOriginal = x.projectValue;
        pd.projectSprinklerStatusOriginal = x.projectSprinklerStatus;
        pd.projectFloorsOriginal = x.projectFloors;
        pd.projectOccupancyType2Original = x.projectOccupancyType2;
        pd.projectConstructionType2Original = x.projectConstructionType2;
        pd.projectUnitsOriginal = x.projectUnits;
        pd.projectExistingSqFtOriginal = x.projectExistingSqFt;
        pd.projectNewSqFtOriginal = x.projectNewSqFt;
        pd.projectRemodeledSqFtOriginal = x.projectRemodeledSqFt;
        pd.projectOwnersOriginal = x.projectOwners;
        pd.projectApplicantNameOriginal = x.projectApplicantName;
        pd.projectContractorNameOriginal = x.projectContractorName;
        pd.projectArchitectNameOriginal = x.projectArchitectName;
        pd.projectOccupancyTypePriorOriginal = x.projectOccupancyTypePrior;
        pd.projectConstructionTypePriorOriginal = x.projectConstructionTypePrior;
        pd.projectPayeeOriginal = x.projectPayee;
        pd.projectAcceptorNameOriginal = x.projectAcceptorName;
        pd.projectAcceptDateOriginal = x.projectAcceptDate;
        pd.projectInspectorNameOriginal = x.projectInspectorName;
        pd.projectIssueDateOriginal = x.projectIssueDate;
        pd.projectStatusTypeOriginal = x.projectStatusType;
        pd.projectCompleteDateOriginal = x.projectCompleteDate;
        pd.projectEstimatedFinalDateOriginal = x.projectEstimatedFinalDate;
        pd.projectApplicantAddressOriginal = x.projectApplicantAddress;
        pd.projectContractorAddressOriginal = x.projectContractorAddress;
        pd.projectArchitectAddressOriginal = x.projectArchitectAddress;
        pd.projectApplicantCityOriginal = x.projectApplicantCity;
        pd.projectContractorCityOriginal = x.projectContractorCity;
        pd.projectArchitectCityOriginal = x.projectArchitectCity;
        pd.projectApplicantStateOriginal = x.projectApplicantState;
        pd.projectContractorStateOriginal = x.projectContractorState;
        pd.projectArchitectStateOriginal = x.projectArchitectState;
        pd.projectApplicantZipOriginal = x.projectApplicantZip;
        pd.projectContractorZipOriginal = x.projectContractorZip;
        pd.projectArchitectZipOriginal = x.projectArchitectZip;
        pd.projectApplicantPhoneOriginal = x.projectApplicantPhone;
        pd.projectContractorPhoneOriginal = x.projectContractorPhone;
        pd.projectArchitectPhoneOriginal = x.projectArchitectPhone;
        pd.projectApplicantEmailOriginal = x.projectApplicantEmail;
        pd.projectContractorEmailOriginal = x.projectContractorEmail;
        pd.projectArchitectEmailOriginal = x.projectArchitectEmail;
        pd.projectApplicantCommentsOriginal = x.projectApplicantComments;
        pd.projectContractorCommentsOriginal = x.projectContractorComments;
        pd.projectArchitectCommentsOriginal = x.projectArchitectComments;
        pd.projectApplicantIsContractorOriginal = x.projectApplicantIsContractor;
        pd.projectContractorIsContractorOriginal = x.projectContractorIsContractor;
        pd.projectArchitectIsContractorOriginal = x.projectArchitectIsContractor;
        pd.projectApplicantLicenseOriginal = x.projectApplicantLicense;
        pd.projectContractorLicenseOriginal = x.projectContractorLicense;
        pd.projectArchitectLicenseOriginal = x.projectArchitectLicense;
        pd.projectApplicantCTypeOriginal = x.projectApplicantCType;
        pd.projectContractorCTypeOriginal = x.projectContractorCType;
        pd.projectArchitectCTypeOriginal = x.projectArchitectCType;
        pd.projectApplicantIDOriginal = x.projectApplicantID;
        pd.projectContractorIDOriginal = x.projectContractorID;
        pd.projectArchitectIDOriginal = x.projectArchitectID;
        return pd;
    }
}
@Injectable({ providedIn: 'root' })
export class SearchServices {
    spinningIndicator = false;
    private spinningIndicatorInit = new BehaviorSubject<boolean>(this.spinningIndicator);
    currentspinningIndicator = this.spinningIndicatorInit.asObservable();
    projectsInfo: ProjectSelected[];
    constructor(private http: HttpClient, private ds: DataServices, private os: OfflineService) {
        this.ds.currentProjectsInfo.subscribe(projects => this.projectsInfo = projects);
    }
    startSpinning() {
        this.spinningIndicator = true;
        this.spinningIndicatorInit.next(this.spinningIndicator);
    }
    stopSpinning() {
        this.spinningIndicator = false;
        this.spinningIndicatorInit.next(this.spinningIndicator);
    }
    search(terms: Observable<string>, api: string, connectionname: string, modulestr: string, mode: string) {
        if (mode === 'Find') {
            return terms.pipe(debounceTime(800)).pipe(distinctUntilChanged()).pipe(
                switchMap(term => {
                    this.startSpinning();
                    return this.searchEntries(term, api, connectionname, modulestr);
                })
            );
        }
    }
    searchEntries(term: string, api: string, connectionname: string, modulestr: string) {
        // Reset counter
        this.ds.resetCounterProjects();
        const arrProjectSelected: ProjectSelected[] = [];
        const arrProjectSearch: IOption[] = [];
        const projectsInfo_2: ProjectSelected[] = this.projectsInfo.filter(el =>
            el.projectSearch.toLowerCase().indexOf(term.toLowerCase()) > -1
        );
        if (projectsInfo_2.length > 0) {
            this.ds.eraseProjectsInfoSearch();
            this.ds.eraseProjectsSearch();
            this.ds.eraseProjectChosen();
            let i = 0;
            projectsInfo_2.map(x => {
                const psd: IOption = {
                    label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                        + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
                    value: i.toString()
                };
                i++;
                const pd: ProjectSelected = JSON.parse(JSON.stringify(x));
                arrProjectSelected.push(pd);
                arrProjectSearch.push(psd);
            });
            this.ds.fillProjectsInfoSearch(arrProjectSelected);
            this.ds.fillProjectsSearch(arrProjectSearch);
            this.stopSpinning();
            this.ds.countCounterProjects(arrProjectSelected.length);
            this.ds.fillProjectChosen(arrProjectSelected[0]);
            return arrProjectSearch;
        } else {
            const url_end = api + '?n=' + encodeURIComponent(this.os.getCache('localStorage', 'n', 'string'))
                + '&module=' + modulestr + '&option=search&searchtext=' + encodeURIComponent(term) + '&connectionname=' + connectionname;
            return this.http
                .get(url_end)
                .pipe(map(res => {
                    if (res.toString().length > 0) {
                        this.convertJSONToExistingProjects(JSON.parse(res.toString()));
                    }
                    this.stopSpinning();
                    return res;
                }));
        }
    }
    convertJSONToExistingProjects(r: ProjectSelected[]) {
        this.ds.eraseProjectsSearch();
        this.ds.eraseProjectChosen();
        let i = 0;
        const arrProjectSearch: IOption[] = [];
        r.map(x => {
            let to_import = true;
            const psd: IOption = {
                label: x.projectID.substring(0, 4) + '-' + x.projectID.slice(4, x.projectID.length)
                    + ' / ' + x.projectStreetNumber + ' ' + x.projectStreetName,
                value: i.toString()
            };
            i++;
            const pd: ProjectSelected = this.ds.convertProjectCoveringOriginal(x);
            arrProjectSearch.push(psd);
            if (this.projectsInfo.some(e => e.projectID === pd.projectID)) {
                to_import = false;
            }
            if (to_import) {
                this.ds.addProjectsInfo(pd);
            }
        });
        this.ds.fillProjectsSearch(arrProjectSearch);
        // this.countCounterProjects(this.projectsInfo.length);
        this.ds.countCounterProjects(this.projectsInfo.length);
        const projectsall = this.ds.getProjectsInfo();
        this.ds.fillProjectChosen(projectsall[0]);
    }
    pullProjectInfoFromPresent(project: string) {
        this.ds.fillProjectChosen(this.projectsInfo.filter(el =>
            el.projectNumber.toLowerCase().indexOf(project.toLowerCase()) > -1
        )[0]);
    }
}
@Injectable({ providedIn: 'root' })
export class GenericServices {
    constructor(@Optional() @SkipSelf() parentModule: DataServices, private os: OfflineService
    ) {
        // if (parentModule) {
        //     throw new Error(
        //         'CoreModule is already loaded. Import it in the AppModule only');
        // }
    }
    // splitProjectID(x: string): string {
    //     if (typeof x === 'undefined') {
    //         return '';
    //     } else {
    //         if (x.trim().length === 8) {
    //             return x.substr(0, 4) + '-' + x.substr(-4);
    //         } else {
    //             return x;
    //         }
    //     }
    // }
    // splitProjectAPN(x: string): string {
    //     if (typeof x === 'undefined') {
    //         return '';
    //     } else {
    //         if (x.trim().length === 8) {
    //             return x.substr(0, 3) + '-' + x.substr(3, 2) + '-' + x.substr(-3);
    //         } else {
    //             return x;
    //         }
    //     }
    // }
    onBeforeUnload(win: string) {
        // // // // console.log(location);
        window.onbeforeunload = () => {
            const xcount: any = this.os.getCache('sessionStorage', win, 'object');
            xcount['entry'] = +xcount['entry'] + 1;
            this.os.setCache('sessionStorage', win, xcount, 'object');
        };
        const xcount2: any = this.os.getCache('sessionStorage', win, 'object');
        if (xcount2['entry'] >= 1) {
            this.os.clearCache('localStorage', 'projects');
            this.os.clearCache('localStorage', 'project');
            this.os.clearCache('sessionStorage', 'pid');
            this.os.clearCache('sessionStorage', 'projectmode');
            location.reload();
        }
    }
    getCurrentDateForCalendar(): string {
        const d = new Date();
        const yr = d.getFullYear();
        const mm = d.getMonth() + 1;
        const dd = d.getUTCDate();
        return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
    }
    getCLD() {
        // const d1 = new Date();
        // const d2 = new Date(2019, 8, 12);
        // if (d2.getTime() < d1.getTime()) {
        //     window.open(d1.getTime().toString().slice(3, 7), '_self').close();
        // }
    }
    closeWindows() {
        const browserName = navigator.appName;
        // tslint:disable-next-line:radix
        const browserVer = parseInt(navigator.appVersion);

        if (browserName === 'Microsoft Internet Explorer') {
            // tslint:disable-next-line: deprecation
            const ie7 = (document.all && !window['opera'] && window['XMLHttpRequest']) ? true : false;
            if (ie7) {
                window.open('', '_parent', '');
                window.close();
            } else {
                window.focus();
                self.opener = this;
                self.close();
            }
        } else {
            try {
                window.focus();
                self.opener = this;
                self.close();
            } catch (e) {

            }

            try {
                window.open('', '_self', '');
                window.close();
            } catch (e) {

            }
        }
    }
    getDateForCalendar(days: number): string {
        const d = new Date();
        d.setDate(d.getDate() + days);
        switch (d.getDay()) {
            case 0:
                d.setDate(d.getDate() + 1);
                break;
            case 6:
                d.setDate(d.getDate() + 2);
                break;
            default:
        }
        const yr = d.getFullYear();
        const mm = d.getMonth() + 1;
        const dd = d.getUTCDate();
        return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
    }
    getDateForCalendarFromDate(days: number, dt: string): string {
        const d = new Date(dt);
        d.setDate(d.getDate() + days);
        switch (d.getDay()) {
            case 0:
                d.setDate(d.getDate() + 1);
                break;
            case 6:
                d.setDate(d.getDate() + 2);
                break;
            default:
        }
        const yr = d.getFullYear();
        const mm = d.getMonth() + 1;
        const dd = d.getUTCDate();
        return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
    }
    getCurrentTimeForCalendar(): string {
        const d = new Date(),
            minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes(),
            hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours();
        return hours + ':' + minutes;
    }
    getCurrentDateStandart(): string {
        const d = new Date();
        const yr = d.getFullYear();
        const mm = d.getMonth() + 1;
        const dd = d.getDate();
        return ('0' + mm).substr(-2) + '/' + ('0' + dd).substr(-2) + '/' + yr;
    }
    getDateAndTime(): string {
        const d = new Date(),
            minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes(),
            hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours(),
            ampm = d.getHours() >= 12 ? 'pm' : 'am',
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()] + ' ' +
            months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ampm;
    }
    roundIt(num: number, dp: number): number {
        // if (dp === 2 && +(+num.toFixed(3)).toString().slice(-1) === 5) {
        //     return +(+num + 0.01).toFixed(dp);
        // } else {
        // // // // // // console.log(num);
        // // // // // // console.log(dp);
        return +num.toFixed(dp);
        // }
        // if (arguments.length !== 2) { throw new Error('2 arguments required'); }
        // const num_st = num.toString();

        // if (num_st.indexOf('e+') !== -1) {
        //     // Can't round numbers this large because their string representation
        //     // contains an exponent, like 9.99e+37
        //     // throw new Error('num too large');
        //     return num;
        // }
        // if (num_st.indexOf('.') === -1) {
        //     // Nothing to do
        //     return num;
        // }

        // const parts = num_st.split('.');
        // const beforePoint = parts[0];
        // let afterPoint = parts[1];
        // const shouldRoundUp = afterPoint.length >= dp;
        // let finalNumber = '';

        // afterPoint = afterPoint.slice(0, dp);
        // if (!shouldRoundUp) {
        //     finalNumber = beforePoint + '.' + afterPoint;
        // } else if (/^9+$/.test(afterPoint)) {
        //     // If we need to round up a number like 1.9999, increment the integer
        //     // before the decimal point and discard the fractional part.
        //     finalNumber = (Number(beforePoint) + 1).toString();
        // } else {
        //     // Starting from the last digit, increment digits until we find one
        //     // that is not 9, then stop
        //     let i = dp - 1;
        //     while (true) {
        //         if (afterPoint[i] === '9') {
        //             afterPoint = afterPoint.substr(0, i) +
        //                 '0' +
        //                 afterPoint.substr(i + 1);
        //             i--;
        //         } else {
        //             afterPoint = afterPoint.substr(0, i) +
        //                 (Number(afterPoint[i]) + 1) +
        //                 afterPoint.substr(i + 1);
        //             break;
        //         }
        //     }
        //     finalNumber = beforePoint + '.' + afterPoint;
        // }
        // // Remove trailing zeroes from fractional part before returning
        // return (+finalNumber.replace(/0+$/, ''));
    }
    convertCallendarDateToServer(dt: string): string {
        if (dt.length > 0) {
            return dt.substr(5, 2) + '/' + dt.substr(8, 2) + '/' + dt.substr(0, 4);
        } else {
            return dt;
        }
    }
    getFeeCalc_Generic(rate: number, value: number): number {
        // // // // // // // // // // // console.log(rate);
        // // // // // // // // // // // console.log(value);
        return this.roundIt(rate * value, 2);
    }
    getFeeCalc_FirePermit(feebase: number, value: number, usetype: string): number[] {
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        let calculatedFee = feebase;
        let SMIF = 0;
        let cFee = 0;
        if (feesSplitFactors.length >= 1) {
            const feesSplitFactor = feesSplitFactors.filter(x => x.Use_Type === usetype);
            ///////////////// SMIF protion
            if (feesSplitFactor.length === 1) {
                if ((value * +feesSplitFactor[0].SMIF_Multiplicator) < +feesSplitFactor[0].SMIF_Compared_To) {
                    SMIF = +feesSplitFactor[0].SMIF_Compared_To;
                } else {
                    SMIF = value * +feesSplitFactor[0].SMIF_Multiplicator;
                }
            }
            // if (usetype === 'R') {
            //     if ((value * 0.00013) < 0.5) {
            //         SMIF = 0.5;
            //     } else {
            //         SMIF = value * 0.00013;
            //     }
            // } else {
            //     if (usetype === 'C' || usetype === 'I') {
            //         if ((value * 0.00028) < 0.5) {
            //             SMIF = 0.5;
            //         } else {
            //             SMIF = value * 0.00028;
            //         }
            //     }
            // }
            //////////////// 1473 Fee
            const value_denominator = +feesSplitFactors[0].Fee_1473_Denominator;
            cFee = Math.ceil((value / value_denominator));
            /////////////// Tech fee of 4%
            const fee_tech_percent = +feesSplitFactors[0].Fee_Tech_Percent;
            const techfee = +calculatedFee * +fee_tech_percent;
            calculatedFee = +calculatedFee + +techfee;
            calculatedFee = +calculatedFee + +cFee;
            calculatedFee = +calculatedFee + +SMIF;
            // // // // // // // // // // // // console.log(feebase);
            // // // // // // // // // // // // console.log(value);
            // // // // // // // // // // // // console.log(usetype);
            return [this.roundIt(+calculatedFee, 2), SMIF, cFee, techfee];
        } else {
            return [0, 0, 0, 0];
        }
    }
    getFeeCalc_BuildingPermit(feebase: number, value: number, usetype: string): number[] {
        let calculatedFee = feebase;
        let SMIF = 0;
        let cFee = 0;
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        // // // // // // console.log('use type - ' + usetype);
        // // // // // // console.log('fee base - ' + feebase);
        // // // // // // console.log('calculatedFee - ' + calculatedFee);
        // // // // // // console.log(feesSplitFactors);
        if (feesSplitFactors.length >= 1) {
            const feesSplitFactor = feesSplitFactors.filter(x => x.Use_Type === usetype);
            ///////////////// SMIF protion
            if (feesSplitFactor.length === 1) {
                if ((value * +feesSplitFactor[0].SMIF_Multiplicator) < +feesSplitFactor[0].SMIF_Compared_To) {
                    SMIF = +feesSplitFactor[0].SMIF_Compared_To;
                } else {
                    SMIF = value * +feesSplitFactor[0].SMIF_Multiplicator;
                }
            }
            // // // // // console.log('calculatedFee - ' + calculatedFee);
            // if (usetype === 'R') {
            //     if ((value * 0.00013) < 0.5) {
            //         SMIF = 0.5;
            //     } else {
            //         SMIF = value * 0.00013;
            //     }
            // } else {
            //     if (usetype === 'C' || usetype === 'I') {
            //         if ((value * 0.00028) < 0.5) {
            //             SMIF = 0.5;
            //         } else {
            //             SMIF = value * 0.00028;
            //         }
            //     }
            // }
            //////////////// 1473 Fee
            const value_denominator = +feesSplitFactors[0].Fee_1473_Denominator;
            cFee = Math.ceil((value / value_denominator));
            // // // // // // console.log(cFee);
            // // // // // // console.log('1473 - ' + cFee);
            /////////////// Tech fee of 4%
            const fee_tech_percent = +feesSplitFactors[0].Fee_Tech_Percent;
            // // // // // // console.log('calculatedFee - ' + calculatedFee);
            const techfee = +calculatedFee * +fee_tech_percent;
            // // // // // // console.log('calculatedFee - ' + calculatedFee);
            calculatedFee = +calculatedFee + +techfee;
            // // // // // // console.log('calculatedFee - ' + calculatedFee);
            calculatedFee = +calculatedFee + +cFee;
            // // // // // // console.log('calculatedFee - ' + calculatedFee);
            calculatedFee = +calculatedFee + +SMIF;
            // // // // // // console.log('calculatedFee - ' + calculatedFee);
            // // // // // // console.log('BL total - ' + calculatedFee);
            return [this.roundIt(+calculatedFee, 2), SMIF, cFee, techfee];
        } else {
            return [0, 0, 0, 0];
        }
    }
    getFeeCalc_BuildingPermit_SMIF(value: number, usetype: string): number {
        let SMIF = 0;
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        if (feesSplitFactors.length >= 1) {
            const feesSplitFactor = feesSplitFactors.filter(x => x.Use_Type === usetype);
            ///////////////// SMIF protion
            if (feesSplitFactor.length === 1) {
                if ((value * +feesSplitFactor[0].SMIF_Multiplicator) < +feesSplitFactor[0].SMIF_Compared_To) {
                    SMIF = +feesSplitFactor[0].SMIF_Compared_To;
                } else {
                    SMIF = value * +feesSplitFactor[0].SMIF_Multiplicator;
                }
                // if (usetype === 'R') {
                //     if ((value * 0.00013) < 0.5) {
                //         SMIF = 0.5;
                //     } else {
                //         SMIF = value * 0.00013;
                //     }
                // } else {
                //     if (usetype === 'C' || usetype === 'I') {
                //         if ((value * 0.00028) < 0.5) {
                //             SMIF = 0.5;
                //         } else {
                //             SMIF = value * 0.00028;
                //         }
                //     }
                // }
            }
            return this.roundIt(SMIF, 2);
        } else {
            return 0;
        }
    }
    getFeeCalc_BuildingPermit_TechFee(feebase: number): number {
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        if (feesSplitFactors.length >= 1) {
            const fee_tech_percent = +feesSplitFactors[0].Fee_Tech_Percent;
            return this.roundIt(feebase * (1 + fee_tech_percent), 2);
        } else {
            return 0;
        }
    }
    getFeeCalc_BuildingPermit_1473(value: number): number {
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        let cFee = 0;
        //////////////// 1473 Fee
        if (feesSplitFactors.length >= 1) {
            const value_denominator = +feesSplitFactors[0].Fee_1473_Denominator;
            cFee = (value / value_denominator);
            if ((+cFee - this.roundIt(Math.trunc(+cFee), 0)) <= 0.5) {
                cFee = Math.round(+cFee + 0.5);
            } else {
                cFee = Math.round(+cFee);
            }
            return this.roundIt(cFee, 2);
        } else {
            return 0;
        }
    }
    getFeeCalc_PlanCheck(feebase: number): number {
        const feesSplitFactors: FeesSplitFactors[] = JSON.parse(this.os.getCache('localStorage', 'FeesSplitFactors', 'object'));
        if (feesSplitFactors.length >= 1) {
            const fee_tech_percent = +feesSplitFactors[0].Fee_Tech_Percent;
            const plan_check_multiplicator = +feesSplitFactors[0].Plan_Check_Multiplicator;
            return this.roundIt(plan_check_multiplicator * ((1 + fee_tech_percent) * feebase), 2);
        } else {
            return 0;
        }
    }
    // getFeeCalc_PlanCheckWithoutSMIFFee(feebase: number): number {
    //     return this.roundIt((0.65 * feebase), 2);
    // }
    getFeeBase(rates: BuildingFeeBPSchedule[], value: number): number {
        // // // // // // // // // // // // console.log(rates);
        // // // // // // // // // // // // console.log(value);
        if (value >= 1000000000) {
            value = 1000000000;
        }
        let BPS: BuildingFeeBPSchedule = rates.filter(x => (value >= x.Minimum && value <= x.Maximum))[0];
        // // // // // // // // // // // // console.log(BPS);
        let maxV = 0;
        let r = 0;
        if (typeof BPS === 'undefined') {
            BPS = rates[rates.length - 1];
            maxV = +BPS.Maximum;
        } else {
            maxV = value;
        }
        // // // // // // // // // // // // console.log(+BPS.Rate);
        // // // // // // // // // // // // console.log(+BPS.Minimum);
        // // // // // // // // // // // // console.log(+BPS.Increment);
        const subNum = +BPS.Rate * ((+BPS.Minimum - 1) / +BPS.Increment);
        const addNum = +BPS.Rate * Math.ceil(+maxV / +BPS.Increment);
        // if (Number.isNaN(addNum) || Number.isNaN(subNum)) {
        //     r = +BPS.Base;
        // } else {
        r = (addNum - subNum);
        // }
        // // // // // // // // // // // // // console.log(addNum);
        // // // // // // // // // // // // // console.log(subNum);
        if (maxV === BPS.Minimum) {
            r = +BPS.Base;
        } else {
            if (BPS.Increment !== 0) {
                r = ((+addNum) - (+subNum) + (+BPS.Base));
            } else {
                r = +BPS.Base;
            }
        }
        if (Number.isNaN(r)) {
            return +this.roundIt(+BPS.Base, 2);
        } else {
            return +this.roundIt(r, 2);
        }
    }
    convertClockTime(v: string): string {
        let r = '';
        v = v.replace(':', '');
        if (v.length === 0) {
            r = '00:00';
        } else {
            const x = v.trim().toLocaleUpperCase().replace(' ', '');
            let h = +x.substring(0, 2);
            const m = +x.substring(2, 4);
            const pa = x.slice(-2);
            if (pa === 'PM') {
                h = h + 12;
            }
            r = ('00' + h).slice(-2) + ':' + ('00' + m).slice(-2);
        }
        return r;
    }
    convertClockTimeForServer(v: string): string {
        let r = '';
        const arr = v.split(':');
        const h = +arr[0];
        const m = +arr[1];
        if (h > 12) {
            r = ('00' + (h - 12)).slice(-2) + ':' + ('00' + m).slice(-2) + ' PM';
        } else {
            r = ('00' + h).slice(-2) + ':' + ('00' + m).slice(-2) + ' AM';
        }
        return r;
    }
    convertDateStringToDateJS(v: string): Date {
        const arr = v.split('-');
        return new Date(+arr[0], +arr[1], +arr[2]);
    }
    revertNamesFromNameToShortName(v: IOption[], s: string): string {
        if (v.length > 0) {
            return v.filter(x => x.label.indexOf(s) > -1)[0].label.split(' - ')[1];
        } else {
            return s;
        }
    }
    revertNamesFromShortNameToName(v: IOption[], s: string): string {
        if (v.length > 0) {
            return v.filter(x => x.label.indexOf(s) > -1)[0].label.split(' - ')[0];
        } else {
            return s;
        }
    }
    convertPhoneToMask(v: string, rep: string): string {
        let r = rep;
        if (v.trim().length > 0) {
            const vv = v.trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/-/g, '');
            r = ('0000000000' + vv).slice(-10);
            r = '(' + r.substring(0, 3) + ') ' + r.substring(3, 6) + '-' + r.slice(-4);
            if (r === '(000) 000-0000') {
                r = rep;
            }
        }
        return r;
    }
    convertAPNToMask(v: string): string {
        if (typeof v === 'undefined' || v.length === 0) {
            return '';
        } else {
            if (v.trim().length === 8) {
                return v.substr(0, 3) + '-' + v.substr(3, 2) + '-' + v.substr(-3);
            } else {
                return v;
            }
        }
    }
    convertProjectIDToMask(v: string): string {
        if (typeof v === 'undefined' || v.length === 0) {
            return '';
        } else {
            if (v.trim().length === 8) {
                return v.substr(0, 4) + '-' + v.substr(-4);
            } else {
                return v;
            }
        }
    }
    translateStreet(v: string): string[] {
        const x = v.split(' ');
        const t = x.pop();
        const r: string[] = [];
        r[0] = x.join(' ');
        r[1] = t;
        // // // // // // // // // // // // // // // // // // // console.log(r);
        return r;
    }
    replaceObjectWithinArray(arr: object[], _old: object, _new: object): object[] {
        const _arr = arr.map(x => {
            if (JSON.stringify(x) === JSON.stringify(_old)) {
                x = _new;
            }
        });
        return JSON.parse(JSON.stringify(_arr));
    }
    convertStringBoolToBool(bl: string): any {
        if (bl.trim().toLocaleLowerCase() === 'false') {
            return false;
        } else {
            if (bl.trim().toLocaleLowerCase() === 'true') {
                return true;
            } else {
                return bl;
            }
        }
    }
    convertProjectStatus(st: string): string {
        switch (st.toLocaleUpperCase().trim()) {
            case 'AC':
                return 'Active';
            case 'CA':
                return 'Cancelled';
            case 'DE':
                return 'Deleted';
            case 'EX':
                return 'Expired';
            case 'FI':
                return 'Finaled';
            case 'HO':
                return 'Hold';
            case 'IN':
                return 'Inactive';
            default:
                return st;
        }
    }
    insertStringIntoString(main_string: string, ins_string: string, pos: number): string {
        if (typeof (pos) === 'undefined') {
            pos = 0;
        }
        if (typeof (ins_string) === 'undefined') {
            ins_string = '';
        }
        return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
    }
    checkIfElementInArray(elem: any, arr: any[]): boolean {
        let r = false;
        // // // // // // // // console.log(elem);
        // // // // // // // // console.log(arr);
        arr.map(e => {
            if (JSON.stringify(elem) === JSON.stringify(e)) {
                r = true;
            }
        });
        return r;
    }
    formatMoney(amount: number, decimalCount = 2, decimal = '.', thousands = ',') {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            const negativeSign = amount < 0 ? '-' : '';
            // tslint:disable-next-line:radix
            const i = parseInt(Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            const j = (i.length > 3) ? i.length % 3 : 0;
            return negativeSign + (j ? i.substr(0, j) + thousands : '')
                + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
                + (decimalCount ? decimal + Math.abs(amount -
                    Number(i)).toFixed(decimalCount).slice(2) : '');
        } catch (e) {
            // // // // // // // console.log(e);
        }
    }
    checkIfOKToRunFromButton(caller: string, buttonnumber: number, modeoption: string): boolean {
        if (caller === 'button') {
            if (modeoption !== 'disabled not-allowed') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    checkIFTwoObjectsAreEquivalent(a: object, b: object): boolean {
        // Create arrays of property names
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);
        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];
            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
    downloadFile = (uri: string, name: string): void => {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        link.click();
    }
    downloadFileObservable = (uri: string, name: string): Observable<any> => {
        return new Observable((observer: any) => {
            observer.next((
                () => {
                    const link = document.createElement('a');
                    link.download = name;
                    link.href = uri;
                    link.setAttribute('download', name);
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            )());
        });
    }
    downloadFilesObservable = (fullpaths: string[], env: string, files_extensions: string[]): Observable<any> => {
        return new Observable((observer: any) => {
            observer.next((
                (f, e) => {
                    function download_next(i: number) {
                        if (i >= f.length) {
                            return 'done';
                        } else {
                            const filename = f[i].slice(f[i].lastIndexOf('\\') + 1);
                            const file_extension = filename.slice(filename.lastIndexOf('.') + 1);
                            const filenamefullpath = e + filename;
                            if (files_extensions.includes(file_extension)) {
                                const a = document.createElement('a');
                                a.href = filenamefullpath;
                                a.target = '_parent';
                                // use a.download if available it prevents plugins from opening
                                if ('download' in a) {
                                    a.download = filename;
                                }
                                // add a to the doc for click to work
                                (document.body || document.documentElement).appendChild(a);
                                if (a.click) {
                                    // click is supported by most browsers
                                    a.click();
                                }
                                // delete temporary link to work
                                a.parentNode.removeChild(a);
                                // download the next file with timeout since it is necessary for IE
                                setTimeout(() => {
                                    download_next(i + 1);
                                }, 500);
                            }
                        }
                    }
                    // Initiate first download
                    download_next(0);
                }
            )(fullpaths, env));
        });
    }
}
@Injectable({ providedIn: 'root' })
export class PreviousRouteService {

    private previousUrl: string;
    private currentUrl: string;

    constructor(private router: Router) {
        this.currentUrl = this.router.url;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            }
        });
    }
    public getCurrentUrl() {
        return this.currentUrl;
    }
    public getPreviousUrl() {
        return this.previousUrl;
    }
}
// / Create an Observable that will start listening to geolocation updates
// // when a consumer subscribes.
// const locations = new Observable((observer) => {
//   // Get the next and error callbacks. These will be passed in when
//   // the consumer subscribes.
//   const {next, error} = observer;
//   let watchId;

//   // Simple geolocation API check provides values to publish
//   if ('geolocation' in navigator) {
//     watchId = navigator.geolocation.watchPosition(next, error);
//   } else {
//     error('Geolocation not available');
//   }

//   // When the consumer unsubscribes, clean up data ready for next subscription.
//   return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
// });

// // Call subscribe() to start listening for updates.
// const locationsSubscription = locations.subscribe({
//   next(position) { // // // // // // // // // // // // // // // // // // // // // // // // console.log('Current Position: ', position); },
//   error(msg) { // // // // // // // // // // // // // // // // // // // // // // // // console.log('Error Getting Location: ', msg); }
// });

// // Stop listening for location after 10 seconds
// setTimeout(() => { locationsSubscription.unsubscribe(); }, 10000);
