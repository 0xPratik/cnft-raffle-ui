import * as anchor from "@coral-xyz/anchor";

export type EnvCluster = "devnet" | "testnet" | "mainnet-beta";

export type RewardAsset = {
  reward: anchor.web3.PublicKey;
  randomNo: number;
};

export interface RaffleItem {
  raffle: string;
  price: number;
  soldTickets: number;
  assets: RewardAsset[];
  ticketsTotal: number;
  endDate: Date | null;
  ticketMint: string;
  treasuryAccount: string;
}

export interface RaffleCardInterface extends RaffleItem {
  ticketsPurchased?: number;
  favorited?: boolean;
}

type Grouping = {
  group_key: string;
  group_value: string;
};

export type Item = {
  interface: string;
  id: string;
  content: Content;
  authorities: Authority[];
  compression: Compression;
  grouping: Grouping[];
  royalty: Royalty;
  creators: Creator[];
  ownership: Ownership;
  supply: Supply;
  mutable: boolean;
  burnt: boolean;
};

export type Authority = {
  address: string;
  scopes: string[];
};

export type Compression = {
  eligible: boolean;
  compressed: boolean;
  dataHash: string;
  creatorHash: string;
  assetHash: string;
  tree: string;
  seq: number;
  leafID: number;
};

export type Content = {
  schema: string;
  jsonURI: string;
  files: File[];
  metadata: Metadata;
  links: Links;
};

export type File = {
  uri: string;
  cdnURI: string;
  mime: string;
};

export type Links = {
  image: string;
  externalURL: string;
};

type Metadata = {
  attributes: Attribute[];
  description: string;
  name: string;
  symbol: string;
  tokenStandard: string;
};

type Attribute = {
  value: string;
  traitType: string;
};

type Creator = {
  address: string;
  share: number;
  verified: boolean;
};

type Ownership = {
  frozen: boolean;
  delegated: boolean;
  delegate: null;
  ownershipModel: string;
  owner: string;
};

type Royalty = {
  royaltyModel: string;
  target: null;
  percent: number;
  basisPoints: number;
  primarySaleHappened: boolean;
  locked: boolean;
};

type Supply = {
  printMaxSupply: number;
  printCurrentSupply: number;
  editionNonce: number;
};

export type NFTResponse = {
  id: string;
  jsonrpc: string;
  result: {
    total: number;
    limit: number;
    page: number;
    items: Item[];
  };
};

export type GetAssetType = {
  jsonrpc: string;
  result: Item;
  id: string;
};
