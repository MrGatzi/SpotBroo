export interface PublicationMarketDocument {
  mRID: string;
  revisionNumber: number;
  type: string;
  sender_MarketParticipant: MarketParticipant;
  receiver_MarketParticipant: MarketParticipant;
  createdDateTime: string;
  period: TimeInterval;
  TimeSeries: TimeSeries[];
}

export interface MarketParticipant {
  mRID: string;
  marketRole: MarketRole;
}

export interface MarketRole {
  type: string;
}

export interface TimeInterval {
  start: string;
  end: string;
}

export interface TimeSeries {
  mRID: number;
  auctionType: string;
  businessType: string;
  inDomain: Domain;
  outDomain: Domain;
  contractMarketAgreementType: string;
  currencyUnitName: string;
  priceMeasureUnitName: string;
  classificationSequenceAttributeInstanceComponentPosition: number;
  curveType: string;
  Period: Period;
}

export interface Domain {
  mRID: string;
}

export interface Period {
  timeInterval: TimeInterval;
  resolution: string;
  Point: Point[];
}

export interface Point {
  position: number;
  priceAmount: number;
}