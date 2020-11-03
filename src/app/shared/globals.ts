import { Injectable } from '@angular/core';
// import { IOption } from 'ng-select';

@Injectable({ providedIn: 'root' })
export class GlobalStaticVariables {
    public env: Object = {
        api: {
            test: 'http://localhost:44361/',
            test_latest: 'http://localhost:54123/',
            dev: 'http://servername/',
            pro: 'http://servername/',
            api: ''
        },
        excelfilesave: {
            test: 'C:\\Users\\username\\source\\repos\\riskapiservices\\excel\\',
            test_latest: 'C:\\Users\\username\\source\\repos\\riskapiservices_v_2\\riskapiservices_v_2\\excel\\',
            dev: '\\\\servername\\RiskFinance\\excel\\',
            pro: '\\\\servername\\RiskFinance\\excel\\',
            excelfilesave: ''
        },
        excelfiledownload: {
            test: 'http://localhost:44361/excel/',
            test_latest: 'http://localhost:54123/excel/',
            dev: 'http://servername/excel/',
            pro: 'http://servername/excel/',
            excelfilesave: ''
        },
        wccaseprecreatedexcelfiledownload: {
            test: 'http://localhost:44361/wc/files/',
            test_latest: 'http://localhost:54123/wc/files/',
            dev: 'http://servername/wc/files/',
            pro: 'http://servername/wc/files/',
            excelfilesave: ''
        },
        image: {
            test: 'assets/images/',
            test_latest: 'assets/images/',
            dev: 'assets/images/',
            pro: 'assets/images/',
            image: ''
        },
        map: {
            test: '../assets/',
            test_latest: '../assets/',
            dev: 'http://servername/excel/',
            pro: 'http://servername/excel/',
            map: ''
        },
        shortnames: {
            imagelogo: 'trinet_wingmark.png',
            imageearthspin: 'earth0.gif',
            imageearthstop: 'earth0.png'
        },
        messages: {
            nothingfound: 'No records found. Please try again.',
            serverissue: 'Unexpected issue encountered, please try again.',
            projectidnotright: 'Please enter proper Project ID number!',
            filladdressinfo: 'Address Number and Street can NOT be blank',
            fillapnnamestreet: 'Please enter one of: APN, Common Name or Street',
            noresultstoapply: 'There is nothing to be applied!',
            projectmodeedit: 'The project needs to be in Edit mode!',
            projectmodeadd: 'The project needs to be in Add mode!',
            buildingaccess: 'You do not have proper rights to edit Building Processes!',
            landaccess: 'You do not have proper rights to edit Land Processes!',
            plancheckregistring: 'You can not add plan check without first registering Plan for the given project!',
            mandatoryfields: 'Please fill in mandatory fields.',
            assessorfilesnotproper: `Please try again the files need to be texual (.txt)
             and to contain in their names the words DDS and CHR!`,
            assessorfilesissue: `There was an issue with loading the files, please contact IT support!`,
            buildinginspectionmissingid: `Project REPLACE is missing an Issue Date and you will not be able to add Inspection`,
            passwordnotmatched: 'Please make sure that passwords are matching!'
        },
        pk: { k: 'Kole=!6G792%Vd5=' }
    };
    get(keylevel0: string, keylevel1: string) {
        const r = this.env[keylevel0][keylevel1];
        return r;
    }
    getenv(): string { return this.env['main']; }
    setenv(value: string): void {
        this.env['main'] = value;
    }
    setall(): void {
        const _env: string = this.getenv();
        // // // // // // // // // // // // // // // console.log('?????????????????????????????????????????');
        // // // // // // // // // // // // // // // console.log(_env);
        // // // // // // // // // // // // // // // console.log('?????????????????????????????????????????');

        const _api: string = this.env['api'][_env];
        // // // // // // // // // // // // // // // console.log('?????????????????????????????????????????');
        // // // // // // // // // // // // // // // console.log(_api);
        // // // // // // // // // // // // // // // console.log('?????????????????????????????????????????');
        const _excelfilesave: string = this.env['excelfilesave'][_env];
        const _excelfiledownload: string = this.env['excelfiledownload'][_env];
        const _image: string = this.env['image'][_env];
        const _map: string = this.env['map'][_env];
        this.env['api']['api'] = _api;
        this.env['excelfilesave']['excelfilesave'] = _excelfilesave;
        this.env['excelfiledownload']['excelfiledownload'] = _excelfiledownload;
        this.env['image']['image'] = _image;
        this.env['map']['map'] = _map;
    }
}
@Injectable()
export class Globals {
    shownavbar: ShowNavBar = {
        show: false
    };
    getShowBar(): boolean {
        return this.shownavbar.show;
    }
}
export interface ProjectButtons {
    option?: string;
    label?: string;
    position?: number;
    enabled?: string;
}
export interface UserInfo {
    id: string;
    fullname: string;
    name: string;
    pass: string;
    division: string;
    pmrights: string;
    brights: string;
    crights: string;
    lrights: string;
    parights: string;
    adm: string;
    internet: string;
    apipoint: string;
    signalrapipoint: string;
    connectionname: string;
    connectionnameland: string;
    connectionnamestaff: string;
    n: string;
    signalrconnectionid: string;
}
export interface ProjectSelected {
    projectCoordinator?: string;
    projectCoordinatorOriginal?: string;
    projectSearch?: string;
    projectNumber?: string;
    projectID?: string;
    projectExtension?: string;
    projectPT?: string;
    projectBIN?: string;
    projectStreetNumber?: string;
    projectStreetDirection?: string;
    projectStreetName?: string;
    projectStreetType?: string;
    projectStreetApt?: string;
    projectLocationID?: string;
    projectAPN?: string;
    projectDescription?: string;
    projectPermits?: string;
    projectConstructionType?: string;
    projectBuildingType?: string;
    projectUseType?: string;
    projectValue?: string;
    projectSprinklerStatus?: string;
    projectFloors?: string;
    projectOccupancyType2?: string;
    projectConstructionType2?: string;
    projectUnits?: string;
    projectExistingSqFt?: string;
    projectNewSqFt?: string;
    projectRemodeledSqFt?: string;
    projectOwners?: string;
    projectApplicantName?: string;
    projectContractorName?: string;
    projectArchitectName?: string;
    projectOccupancyTypePrior?: string;
    projectConstructionTypePrior?: string;
    projectPayee?: string;
    projectAcceptorName?: string;
    projectAcceptDate?: string;
    projectInspectorName?: string;
    projectIssueDate?: string;
    projectStatusType?: string;
    projectCompleteDate?: string;
    projectEstimatedFinalDate?: string;
    projectApplicantAddress?: string;
    projectContractorAddress?: string;
    projectArchitectAddress?: string;
    projectApplicantCity?: string;
    projectContractorCity?: string;
    projectArchitectCity?: string;
    projectApplicantState?: string;
    projectContractorState?: string;
    projectArchitectState?: string;
    projectApplicantZip?: string;
    projectContractorZip?: string;
    projectArchitectZip?: string;
    projectApplicantPhone?: string;
    projectContractorPhone?: string;
    projectArchitectPhone?: string;
    projectApplicantEmail?: string;
    projectContractorEmail?: string;
    projectArchitectEmail?: string;
    projectApplicantComments?: string;
    projectContractorComments?: string;
    projectArchitectComments?: string;
    projectApplicantIsContractor?: string;
    projectContractorIsContractor?: string;
    projectArchitectIsContractor?: string;
    projectApplicantLicense?: string;
    projectContractorLicense?: string;
    projectArchitectLicense?: string;
    projectApplicantCType?: string;
    projectContractorCType?: string;
    projectArchitectCType?: string;
    projectApplicantID?: string;
    projectContractorID?: string;
    projectArchitectID?: string;
    projectIDOriginal?: string;
    projectExtensionOriginal?: string;
    projectPTOriginal?: string;
    projectBINOriginal?: string;
    projectStreetNumberOriginal?: string;
    projectStreetDirectionOriginal?: string;
    projectStreetNameOriginal?: string;
    projectStreetTypeOriginal?: string;
    projectStreetAptOriginal?: string;
    projectLocationIDOriginal?: string;
    projectAPNOriginal?: string;
    projectDescriptionOriginal?: string;
    projectPermitsOriginal?: string;
    projectConstructionTypeOriginal?: string;
    projectBuildingTypeOriginal?: string;
    projectUseTypeOriginal?: string;
    projectValueOriginal?: string;
    projectSprinklerStatusOriginal?: string;
    projectFloorsOriginal?: string;
    projectOccupancyType2Original?: string;
    projectConstructionType2Original?: string;
    projectUnitsOriginal?: string;
    projectExistingSqFtOriginal?: string;
    projectNewSqFtOriginal?: string;
    projectRemodeledSqFtOriginal?: string;
    projectOwnersOriginal?: string;
    projectApplicantNameOriginal?: string;
    projectContractorNameOriginal?: string;
    projectArchitectNameOriginal?: string;
    projectOccupancyTypePriorOriginal?: string;
    projectConstructionTypePriorOriginal?: string;
    projectPayeeOriginal?: string;
    projectAcceptorNameOriginal?: string;
    projectAcceptDateOriginal?: string;
    projectInspectorNameOriginal?: string;
    projectIssueDateOriginal?: string;
    projectStatusTypeOriginal?: string;
    projectCompleteDateOriginal?: string;
    projectEstimatedFinalDateOriginal?: string;
    projectApplicantAddressOriginal?: string;
    projectContractorAddressOriginal?: string;
    projectArchitectAddressOriginal?: string;
    projectApplicantCityOriginal?: string;
    projectContractorCityOriginal?: string;
    projectArchitectCityOriginal?: string;
    projectApplicantStateOriginal?: string;
    projectContractorStateOriginal?: string;
    projectArchitectStateOriginal?: string;
    projectApplicantZipOriginal?: string;
    projectContractorZipOriginal?: string;
    projectArchitectZipOriginal?: string;
    projectApplicantPhoneOriginal?: string;
    projectContractorPhoneOriginal?: string;
    projectArchitectPhoneOriginal?: string;
    projectApplicantEmailOriginal?: string;
    projectContractorEmailOriginal?: string;
    projectArchitectEmailOriginal?: string;
    projectApplicantCommentsOriginal?: string;
    projectContractorCommentsOriginal?: string;
    projectArchitectCommentsOriginal?: string;
    projectApplicantIsContractorOriginal?: string;
    projectContractorIsContractorOriginal?: string;
    projectArchitectIsContractorOriginal?: string;
    projectApplicantLicenseOriginal?: string;
    projectContractorLicenseOriginal?: string;
    projectArchitectLicenseOriginal?: string;
    projectApplicantCTypeOriginal?: string;
    projectContractorCTypeOriginal?: string;
    projectArchitectCTypeOriginal?: string;
    projectApplicantIDOriginal?: string;
    projectContractorIDOriginal?: string;
    projectArchitectIDOriginal?: string;
    projectStringTransport?: string;
}
export interface CompositeObjectUserAndProject {
    User: UserInfo;
    Project: ProjectSelected;
}
export interface STF {
    fullname: string;
    name: string;
}
export interface ProjectAddress {
    projectNumber: string;
    projectDirection: string;
    projectName: string;
    projectType: string;
    projectApt: string;
    projectAPN: string;
    projectZipCode: string;
    projectOwner: string;
    projectLocationID: string;
}
export interface ShowNavBar {
    show: boolean;
}
export interface LandAddress {
    AddressID: string;
    Status: string;
    AddressType: string;
    StreetID: string;
    Number: string;
    MasterAddressID: string;
    Apt: string;
    MailAddress: string;
    Street: string;
    List: string;
    transport?: string;
}
export interface LandStreet {
    StreetID: string;
    Status: string;
    Street: string;
    Type: string;
    Direction: string;
    List: string;
    transport?: string;
}
export interface LandName {
    NameID: string;
    Status: string;
    Type: string;
    Name: string;
    List: string;
    transport?: string;
}
export interface LandLocCrossRef {
    LocationID: string;
    AddressID: string;
    AssessmentAPN: string;
    ParcelID: string;
    Name: string;
    NameID: string;
    List: string;
    transport?: string;
}
export interface LandAssessment {
    APN: string;
    Status: string;
    Owners: string;
    MailAddress: string;
    MailCityStateZip: string;
    TransferDate: string;
    TaxRateArea: string;
    ValueImprovement: string;
    ValueLand: string;
    Exemption: string;
    SalesPrice: string;
    Phone: string;
    YearBuilt: string;
    Bathrooms: string;
    Bedrooms: string;
    Stories: string;
    BuildingSqFt: string;
    GarageSqFt: string;
    LotSqFt: string;
    Units: string;
    Buildings: string;
    SiteNumber: string;
    SiteStreetApt: string;
    SiteZip2: string;
    SiteZip: string;
    ChangeDate: string;
    SiteStreetApt2: string;
    Street: string;
    Apt: string;
    Dir: string;
    Type: string;
    List: string;
    transport?: string;
}
export interface LandLocation {
    Number: string;
    Street: string;
    Apt: string;
    APN: string;
    Name: string;
    EnvTags: string;
    Identifier1: string;
    Identifier2: string;
    Direction: string;
    Type: string;
    LocationID: string;
    AddressID: string;
    AreaID: string;
    Status: string;
    Owners: string;
    List: string;
    transport?: string;
}
export interface LandAPNChange {
    APNChangeID: string;
    NewAPN: string;
    OldAPN: string;
    EffectiveDate: string;
    Comments: string;
    ChangeDate: string;
    SplitNewAPNs: string;
    CombinedOldAPNs: string;
    List: string;
    transport?: string;
}
export interface LandParcel {

    APN: string;
    Status: string;
    AreaID: string;
    Number: string;
    Street: string;
    Apt: string;
    Name: string;
    AreaType: string;
    Zoning: string;
    LandSqft: string;
    CombiningDistrict: string;
    Acres: string;
    GrossFloorArea: string;
    FAR: string;
    GPD: string;
    Units: string;
    LandUse: string;
    UnitsAcres: string;
    Heritage: string;
    LandUseSub: string;
    UnitsBMR: string;
    DistrictElementary: string;
    HazardousMaterial: string;
    MultiUse: string;
    DistrictHighSchool: string;
    OwnerOccupied: string;
    Well: string;
    OwnerGovernment: string;
    MasterAreaID: string;
    LocationID: string;
    ZipCode: string;
    List: string;
    transport?: string;
}
export interface LandPhoto {
    APN: string;
    Status: string;
    AreaID: string;
    Number: string;
    Street: string;
    Apt: string;
    Name: string;
    AreaType: string;
    Zoning: string;
    LandSqft: string;
    CombiningDistrict: string;
    Acres: string;
    GrossFloorArea: string;
    FAR: string;
    GPD: string;
    Units: string;
    LandUse: string;
    UnitsAcres: string;
    Heritage: string;
    LandUseSub: string;
    UnitsBMR: string;
    DistrictElementary: string;
    HazardousMaterial: string;
    MultiUse: string;
    DistrictHighSchool: string;
    OwnerOccupied: string;
    Well: string;
    OwnerGovernment: string;
    MasterAreaID: string;
    LocationID: string;
    ZipCode: string;
    List: string;
    transport?: string;
}
export interface LandBuilding {
    AreaID: string;
    GrossFloorArea: string;
    Floors: string;
    BuildingFootPrint: string;
    NumberAccessoryBldgs: string;
    Comments: string;
    BuildingID: string;
    List: string;
    transport?: string;
}
export interface PermitTech {
    ProjectID: string;
    Fire: boolean;
    Env: boolean;
    HazMat: boolean;
    Planning: boolean;
    PublicWorks: boolean;
    PW: boolean;
    Flood: boolean;
    SCCHD: boolean;
    EPA: boolean;
    County: boolean;
    ID: number;
    Action: string;
}
export interface LandComment {
    CommentID: string;
    LocationID: string;
    StatusType: string;
    CommentType: string;
    CommentDate: string;
    Commenter: string;
    Comments: string;
    DivisionType: string;
    EffectiveBeginDate: string;
    EffectiveEndDate: string;
    Addr: string;
    StreetTypeDir: string;
    Apt: string;
    APN: string;
    List: string;
    transport?: string;
}
export interface LandParking {
    ParcelID: string;
    Standard: string;
    ParkingAdjacent: string;
    Compact: string;
    ParkingOnly: string;
    HandiCap: string;
    ParkingDistrict: string;
    Total: string;
    ParkingID: string;
    List: string;
    transport?: string;
}
export interface LandPhoto {
    LocationID: string;
    Description: string;
    Date: string;
    Path: string;
    Comments: string;
    PhotoID: string;
    List: string;
    transport?: string;
}
export interface BuildingPlan {
    ProjectID: string;
    RevisionID: string;
    Inspector: string;
    StreetNumber: string;
    StreetDirection: string;
    StreetName: string;
    StreetType: string;
    StreetApt: string;
    StreetDescription: string;
    ReceiveDate: string;
    LetterDate: string;
    ProcessType: string;
    DueDate: string;
    MeetingDate: string;
    PlansRecipient: string;
    List: string;
    transport?: string;
}
export interface BuildingPlanCheck {
    PlanCheckID: string;
    ProjectID: string;
    RevisionID: string;
    DivisionType: string;
    Checker: string;
    StatusType: string;
    Corrections: string;
    CorrectionsBit: string;
    CheckDate: string;
    Inspector: string;
    StreetNumber: string;
    StreetDirection: string;
    StreetName: string;
    StreetType: string;
    StreetApt: string;
    StreetDescription: string;
    ReceiveDate: string;
    LetterDate: string;
    ProcessType: string;
    DueDate: string;
    MeetingDate: string;
    List: string;
    ListOrder: string;
    transport?: string;
}
export interface BuildingPermitHistories {
    ProjectID: string;
    Permits: string;
    AcptDt: string;
    CompDt: string;
    Address: string;
    APN: string;
}
export interface BuildingFees {
    ProjectID: string;
    FeeID: string;
    StreetNumber: string;
    StreetDirection: string;
    StreetName: string;
    StreetType: string;
    StreetApt: string;
    FeeDescription: string;
    Fee: string;
    Permit: string;
    CalcAmount: number;
    CalcAmountSMIF: number;
    CalcAmount1473: number;
    CalcAmountTech: number;
    PaidAmount: number;
    CalcDt: string;
    PaidDt: string;
    FeeTotal: number;
    PaidTotal: number;
    Balance: number;
    OrderPermit: number;
    PaymentType: string;
    List: string;
    CalcDt2: string;
    PaidDt2: string;
    transport: string;
}
export interface BuildingFeesAgg {
    FeeDescription: string;
    Fee: string;
    CalcAmount: number;
    PaidAmount: number;
    PaidDt: string;
}
export class FeesPlumbingMapping {
    public static get BasePlumbing(): number { return 40; }
    public static get FixturesPlumbing(): number { return 60; }
    public static get WaterPlumbing(): number { return 70; }
    public static get SewerPlumbing(): number { return 80; }
    public static get RainwaterPlumbing(): number { return 90; }
    public static get DisposalPlumbing(): number { return 100; }
    public static get HeaterPlumbing(): number { return 110; }
    public static get PipingPlumbing(): number { return 120; }
    public static get Piping2Plumbing(): number { return 130; }
    public static get WastePlumbing(): number { return 140; }
    public static get VentPlumbing(): number { return 150; }
    public static get SprinklerPlumbing(): number { return 160; }
    public static get VacuumPlumbing(): number { return 170; }
    public static get Vacuum2Plumbing(): number { return 180; }
    public static get PlanCheckPlumbing(): number { return 190; }
}
export class FeesMFDIFMapping {
    public static get PagesMFDIF(): number { return 659; }
}
export class FeesElectricalMapping {
    public static get BaseElectrical(): number { return 400; }
    public static get TypeElectrical(): number { return 400; }
    public static get WarehouseElectrical(): number { return 480; }
    public static get NewServiceElectrical(): number { return 430; }
    public static get ServiceElectrical(): number { return 450; }
    public static get Temp1Electrical(): number { return 470; }
    public static get LightElectrical(): number { return 530; }
    public static get Light2Electrical(): number { return 540; }
    public static get MotorElectrical(): number { return 550; }
    public static get ItemElectrical(): number { return 400; }
    public static get ApplianceElectrical(): number { return 644; }
    public static get CircuitElectrical(): number { return 40; }
    public static get Sign1Electrical(): number { return 641; }
    public static get Sign2Electrical(): number { return 642; }
    public static get Sign3Electrical(): number { return 643; }
    public static get PlanCheckElectrical(): number { return 658; }
}
export class FeesMechanicalMapping {
    public static get BaseMechanical(): number { return 200; }
    public static get Furnace1Mechanical(): number { return 210; }
    public static get Furnace2Mechanical(): number { return 220; }
    public static get Furnace3Mechanical(): number { return 210; }
    public static get VentMechanical(): number { return 230; }
    public static get Boiler1Mechanical(): number { return 240; }
    public static get Boiler2Mechanical(): number { return 250; }
    public static get Boiler3Mechanical(): number { return 260; }
    public static get Boiler4Mechanical(): number { return 270; }
    public static get Boiler5Mechanical(): number { return 280; }
    public static get Air1Mechanical(): number { return 290; }
    public static get Air2Mechanical(): number { return 300; }
    public static get FanMechanical(): number { return 310; }
    public static get SystemMechanical(): number { return 320; }
    public static get Hood1Mechanical(): number { return 330; }
    public static get Hood2Mechanical(): number { return 340; }
    public static get Incinerator1Mechanical(): number { return 350; }
    public static get Incinerator2Mechanical(): number { return 360; }
    public static get MiscMechanical(): number { return 370; }
    public static get PlanCheckMechanical(): number { return 380; }
}
export interface BuildingFeesPlumbing {
    ProjectID: string;
    Base: string;
    Fixtures: string;
    Water: string;
    Sewer: string;
    Rainwater: string;
    Disposal: string;
    Heater: string;
    Piping: string;
    Piping2: string;
    Waste: string;
    Vent: string;
    Sprinkler: string;
    Vacuum: string;
    Vacuum2: string;
    PlanCheck: string;
    BaseTotal: string;
    FixturesTotal: string;
    WaterTotal: string;
    SewerTotal: string;
    RainwaterTotal: string;
    DisposalTotal: string;
    HeaterTotal: string;
    PipingTotal: string;
    Piping2Total: string;
    WasteTotal: string;
    VentTotal: string;
    SprinklerTotal: string;
    VacuumTotal: string;
    Vacuum2Total: string;
    PlanCheckTotal: string;
    PlumbingTotal: string;
}
export interface BuildingFeesElectrical {
    ProjectID: string;
    Base: string;
    BaseTotal: string;
    Type: string;
    Warehouse: string;
    NewService: string;
    Service: string;
    Temp1: string;
    Light: string;
    Light2: string;
    Motor: string;
    Item: string;
    Appliance: string;
    Circuit: string;
    Sign1: string;
    Sign2: string;
    Sign3: string;
    PlanCheck: string;
    TypeTotal: string;
    WarehouseTotal: string;
    NewServiceTotal: string;
    ServiceTotal: string;
    Temp1Total: string;
    LightTotal: string;
    Light2Total: string;
    MotorTotal: string;
    ItemTotal: string;
    ApplianceTotal: string;
    CircuitTotal: string;
    Sign1Total: string;
    Sign2Total: string;
    Sign3Total: string;
    PlanCheckTotal: string;
    ElectricalTotal: string;
}
export interface BuildingFeesMechanical {
    ProjectID: string;
    Base: string;
    BaseTotal: string;
    Furnace1: string;
    Furnace2: string;
    Furnace3: string;
    Vent: string;
    Boiler1: string;
    Boiler2: string;
    Boiler3: string;
    Boiler4: string;
    Boiler5: string;
    Air1: string;
    Air2: string;
    Fan: string;
    System: string;
    Hood1: string;
    Hood2: string;
    Incinerator1: string;
    Incinerator2: string;
    Misc: string;
    PlanCheck: string;
    Furnace1Total: string;
    Furnace2Total: string;
    Furnace3Total: string;
    VentTotal: string;
    Boiler1Total: string;
    Boiler2Total: string;
    Boiler3Total: string;
    Boiler4Total: string;
    Boiler5Total: string;
    Air1Total: string;
    Air2Total: string;
    FanTotal: string;
    SystemTotal: string;
    Hood1Total: string;
    Hood2Total: string;
    Incinerator1Total: string;
    Incinerator2Total: string;
    MiscTotal: string;
    PlanCheckTotal: string;
    MechanicalTotal: string;
}
export interface BuildingFeesMFDIF {
    ProjectID: string;
    Pages: string;
    PagesTotal: string;
    MFDIFTotal: string;
}
export interface BuildingFeeBPSchedule {
    ID: number;
    Minimum: number;
    Maximum: number;
    Base: number;
    Rate: number;
    Increment: number;
}
export interface BuildingFeeRate {
    ID: number;
    AbKey: string;
    Description: string;
    FeeType: string;
    Rate: number;
    Type: string;
    FeeOrder: number;
}
export interface BuildingFeeOrder {
    FeeType: string;
    FeeOrder: number;
}
export interface BuildingInspection {
    ProjectID: string;
    InspectionID: string;
    BIPS: string;
    StreetNumber: string;
    StreetDirection: string;
    StreetName: string;
    StreetType: string;
    StreetApt: string;
    StreetDescription: string;
    IssueDate: string;
    UseType: string;
    Permits: string;
    StatusType: string;
    Coordinator: string;
    ScheduleDate: string;
    ScheduleDate2: string;
    AMPM: string;
    RequestDate: string;
    RequestDate2: string;
    RequestTime: string;
    InspectionType: string;
    IsPreScheduled: string;
    Acceptor: string;
    Requestor: string;
    Phone: string;
    Description: string;
    InspectDate: string;
    InspectDate2: string;
    ResultType: string;
    CompleteType: string;
    Inspector: string;
    InspectionCount: string;
    Comments: string;
    Coordinator2: string;
    Coordinator2Date: string;
    Coordinator2Date2: string;
    List: string;
    transport?: string;
}
export interface BuildingInspectionsOnSchedule {
    AMPM: string;
    COUNTER: number;
}
export interface EncryptedSQLExecution {
    user: string;
    connection: string;
    encryptedsql: string;
    result: string;
}
export interface APNCoordinators {
    zCoordinatorParcelID: string;
    APNBook: string;
    APNPageLow: string;
    APNPageHigh: string;
    Coordinator: string;
    ChangerID: string;
    FullName: string;
}
export interface BuildingComments {
    CommentID: string;
    ProjectID: string;
    Commenter: string;
    CommentDate: string;
    Comments: string;
    DivisionType: string;
    List: string;
}
export interface BuildingDST {
    DefSubTrackID: string;
    ProjectID: string;
    DSID: string;
    DSsubID: string;
    DSsubsubID: string;
    RevisionID: string;
    Description: string;
    EorAppr: string;
    DateIn: string;
    DivisionType: string;
    Checker: string;
    StatusType: string;
    DateOut: string;
    CheckDate: string;
    List: string;
    transport: string;
}
export interface DetailInfo {
    label: string;
}
export interface IOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export const GlobalDivision: Array<IOption> = [
    { label: 'BS - Building Inspection', value: 'Building Inspection' },
    { label: 'FD - Fire Inspection', value: 'Fire Inspection' },
    { label: 'PL - Planning', value: 'Planning' },
    { label: 'PR - Parks', value: 'Parks' },
    { label: 'PS - Police', value: 'Police' },
    { label: 'PW - Public Works', value: 'Public Works' },
    { label: 'HZ - Hazardous Materials', value: 'Hazardous Materials' },
    { label: 'EV - Enviromental', value: 'Enviromental' },
    { label: 'SH - Shoreline', value: 'Shoreline' },
    { label: 'UT - Utilities', value: 'Utilities' },
    { label: 'KZ - Kutzmann & Assoc', value: 'Kutzmann & Assoc' },
    { label: 'LP - LP2A', value: 'LP2A' },
    { label: 'AH - Ahearn & Knox', value: 'Ahearn & Knox' },
    { label: 'CM - CMA', value: 'CMA"' },
    { label: 'BH - Berryman & Henigar', value: 'Berryman & Henigar' },
    { label: 'GB - Gage-Babcock', value: 'Gage-Babcock' },
    { label: 'CS - Consultant', value: 'Consultant' },
    { label: 'ZO - Zoning Enforcement', value: 'Zoning Enforcement' },
    { label: 'CA - City Attorney', value: 'City Attorney' },
    { label: 'CC - Code Compliance', value: 'Code Compliance' }
];
export const GlobalFeeTypes: Array<IOption> = [
    { label: 'CD - Com. Dev.', value: 'Com. Dev.' },
    { label: 'AD - Adjustment', value: 'Adjustment' },
    { label: 'BL - Building Permit', value: 'Building Permit' },
    { label: 'CH - Building Plan Check', value: 'Building Plan Check' },
    { label: 'CT - Construction Tax', value: 'Construction Tax' },
    { label: 'DE - Demolition Permit', value: 'Demolition Permit' },
    { label: 'EL - Electrical Permit', value: 'Electrical Permit' },
    { label: 'FP - Fire Permit', value: 'Fire Permit' },
    { label: 'GR - Grading Permit', value: 'Grading Permit' },
    { label: 'IR - Refund', value: 'Refund' },
    { label: 'ME - Mechanical Permit', value: 'Mechanical Permit' },
    { label: `PC - Add'l Plan Check`, value: `Add'l Plan Check` },
    { label: 'PL - Plumbing Permit', value: 'Plumbing Permit' },
    { label: 'RF - Roofing Permit', value: 'Roofing Permit' },
    { label: 'SN - Sign Fee', value: 'Sign Fee' },
    { label: 'SP - Swimming Pool', value: 'Swimming Pool' },
    { label: 'CC - Code Compliance', value: 'Code Compliance' },
    { label: 'LU - Land Use Document Fee', value: 'Land Use Document Fee' },
    { label: 'DI - Digital Imaging', value: 'Digital Imaging' }];
export const GlobalPermitTypes: Array<IOption> = [
    { label: 'BL - Building', value: 'Building' },
    { label: 'CH - Bldg Plan Check', value: 'Bldg Plan Check' },
    { label: 'EL - Electrical', value: 'Electrical' },
    { label: 'PL - Plumbing', value: 'Plumbing' },
    { label: 'ME - Mechanical', value: 'Mechanical' },
    { label: 'DE - Demolition', value: 'Demolition' },
    { label: 'RF - Roof', value: 'Roof' },
    { label: 'FP - Fire Permit', value: 'Fire Permit' },
    { label: 'GR - Grading', value: 'Grading' },
    { label: 'EX - Excavation', value: 'Excavation' },
    { label: 'CC - Code Compliance', value: 'Code Compliance' },
    { label: 'SN - Sign', value: 'Sign' },
    { label: 'SP - Swimming Pool', value: 'Swimming Pool' },
    { label: `PC - Add'l Plan Checks`, value: `Add'l Plan Checks` },
    { label: 'LU - Land Use Document Fee', value: 'Land Use Document Fee' },
    { label: 'OT - Other', value: 'Other' },
    { label: 'EV - EV Charger', value: 'EV Charger' },
    { label: 'PV - Photovoltaic', value: 'Photovoltaic' }
];
export const GlobalDivisionBldg: Array<IOption> = [
    { label: 'BS - Building Inspection', value: 'Building Inspection' },
    { label: 'CC - Code Compliance', value: 'Code Compliance' },
    { label: 'CE - Code Enforcement', value: 'Code Enforcement' },
    { label: 'CG - CSG', value: 'CSG' },
    { label: 'CS - Consultant', value: 'Consultant' },
    { label: 'CR - Community Services', value: 'Community Services' },
    { label: 'DTS - DeptToxicSubControl', value: 'DeptToxicSubControl' },
    { label: 'EP - EPA-MEW', value: 'EPA-MEW' },
    { label: 'EV - Environmental', value: 'Environmental' },
    { label: 'FG - Fish & Game', value: 'Fish & Game' },
    { label: 'FO - Forestry', value: 'Forestry' },
    { label: 'FP - Fire Inspection', value: 'Fire Inspection' },
    { label: 'HD - Health Department', value: 'Health Department' },
    { label: 'HU - Hughes & Assoc.', value: 'Hughes & Assoc.' },
    { label: 'HZ - Hazardous Materials', value: 'Hazardous Materials' },
    { label: 'IN - In-House', value: 'In-House' },
    { label: 'NH - Neighborhood', value: 'Neighborhood' },
    { label: `OC - O'BRIEN`, value: `O'BRIEN` },
    { label: 'PL - Planning', value: 'Planning' },
    { label: 'PS - Public Service', value: 'Public Service' },
    { label: 'PW - Public Works', value: 'Public Works' },
    { label: 'SC – SCA', value: 'SCA' },
    { label: 'SH - Shoreline', value: 'Shoreline' },
    { label: 'SP - Shoreline - parks', value: 'Shoreline - parks' },
    { label: 'US - US Army Corps of', value: 'US Army Corps of' },
    { label: 'WD - Water District', value: 'Water District' },
    { label: 'WM - Waste Management', value: 'Waste Management' }
];
export const GlobalStatus: Array<IOption> = [
    {
        label: 'AP - Approved',
        value: 'Approved'
    },
    {
        label: 'DP - Disapproved',
        value: 'Disapproved'
    },
    {
        label: 'AC - Approved with comments',
        value: 'Approved with comments'
    },
    {
        label: 'NR - Not Yet Reviewed',
        value: 'Not Yet Reviewed'
    }];
export interface CoordinatorParcel {
    zCoordinatorParcelID: string;
    APNBook: string;
    APNPageLow: string;
    APNPageHigh: string;
    Coordinator: string;
    CoordinatorName: string;
    transport: string;
}
export interface FeeBPSchedule {
    zFeeBPScheduleID: string;
    Minimum: string;
    Maximum: string;
    Base: string;
    Rate: string;
    Increment: string;
    transport: string;
}
export interface FeeRate {
    zFeeRateID: string;
    AbKey: string;
    Description: string;
    FeeType: string;
    Rate: string;
    Type: string;
    transport: string;
}
export interface PlanCheckChecker {
    zCheckerID: string;
    Type: string;
    Checker: string;
    Status: string;
    transport: string;
}
export interface PlanCheckDivision {
    zDivisionID: string;
    Type: string;
    Division: string;
    Status: string;
    transport: string;
}
export interface Staff {
    zStaffID: string;
    FullName: string;
    Name: string;
    Password: string;
    Password2: string;
    PrimaryModuleType: string;
    BuildingAccessType: string;
    ComplianceAccessType: string;
    LandAccessType: string;
    PlanningAccessType: string;
    Administrator: string;
    PhotoPath: string;
    BuildingChecker: string;
    PlanningPlanner: string;
    Division: string;
    Phone: string;
    ChangerID: string;
    Inspector: string;
    Acceptor: string;
    Specialist: string;
    transport: string;
}
export interface FilesJsonInfo {
    FileName: string;
    Json: string;
    JsonCount: number;
    API: string;
    PBK: string;
    Connection: string;
    UserName: string;
    UserMachine: string;
    SignalRConnectionID: string;
    SignalRAPIPoint: string;
    SignalRChannel: string;
    SignalREventName: string;
}
export interface PDFWordLength {
    word: string;
    length: number;
}
export interface PDFTextDimmensions {
    w: number;
    h: number;
}
export interface FeesSplitFactors {
    Use_Type: string;
    SMIF_Multiplicator: number;
    SMIF_Compared_To: number;
    Fee_Tech_Percent: number;
    Fee_1473_Denominator: number;
    Plan_Check_Multiplicator: number;
}
