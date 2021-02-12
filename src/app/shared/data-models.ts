export interface LineChart {
    labels?: string[];
    datasets?: DataLineChart[];
    title?: string;
    index?: number;
    width?: number;
    height?: number;
}
export interface DataLineChart {
    data?: number[];
    label?: string;
    borderColor?: string | string[];
    fill?: boolean;
}
export interface BarChart {
    labels?: string[];
    datasets?: DataBarChart[];
    title?: string;
    index?: number;
    width?: number;
    height?: number;
}
export interface RadarChart {
    labels?: string[];
    datasets?: DataBarChart[];
    title?: string;
    index?: number;
    width?: number;
    height?: number;
}
export interface DataBarChart {
    data?: number[];
    label?: string;
    fill?: boolean;
    borderColor?: string | string[];
    backgroundColor?: string | string[];
    borderWidth?: number;
}
export interface SliderInfo {
    min?: number;
    max?: number;
    id?: number;
    value?: number;
    latestyear?: number;
    latestmonth?: number;
    returnedyear?: number;
    returnedmonth?: number;
    returneddate?: string;
    observable?: string;
}
export interface ChartInfo {
    id?: number;
    type?: string;
    width?: number;
    height?: number;
    style?: string;
    observable?: string;
    title?: string;
}
export interface IDataSample1 {
    FILE?: number;
    TIME?: number;
    TIMESTR?: string;
    CASES?: string;
    COUNT?: number;
}
export interface HSLAObject {
    hue?: number;
    saturation?: number;
    lightness?: number;
    alpha?: number;
    HSLAValue?: string;
}
export interface JSONFile {
    Url: string;
    textfile: string;
}
export interface IJSONReports {
    ReportName: string;
    DateOfReference: string;
    Transport: string;
    PBK: string;
    Connection: string;
    UserName: string;
    UserMachine: string;
}
export interface Stock {
    id: string;
    class: string;
    exchange: string;
    symbol: string;
    name: string;
    status: string;
    tradable: boolean;
    marginable: boolean;
    shortable: boolean;
    easy_to_borrow: boolean;
}
export interface StockData {
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}