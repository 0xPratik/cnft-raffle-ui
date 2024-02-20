export type CnftRaffle = {
  version: "0.1.0";
  name: "cnft_raffle";
  instructions: [
    {
      name: "createRaffler";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "rafflerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createRaffle";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "rafflerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "adminAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ticketMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "raffleTreasuryEscrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "endDate";
          type: "i64";
        },
        {
          name: "price";
          type: "u64";
        },
        {
          name: "maxTickets";
          type: "u16";
        }
      ];
    },
    {
      name: "addReward";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treeAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "merkleTree";
          isMut: true;
          isSigner: false;
        },
        {
          name: "logWrapper";
          isMut: false;
          isSigner: false;
        },
        {
          name: "compressionProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "bubblegumProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "root";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "dataHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "creatorHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "nonce";
          type: "u64";
        },
        {
          name: "index";
          type: "u32";
        }
      ];
    },
    {
      name: "claimPrize";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "treeAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "merkleTree";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rafflerAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ticketAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "logWrapper";
          isMut: false;
          isSigner: false;
        },
        {
          name: "compressionProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "bubblegumProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "root";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "dataHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "creatorHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "nonce";
          type: "u64";
        },
        {
          name: "index";
          type: "u32";
        }
      ];
    },
    {
      name: "createTicket";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ticketAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ticketMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "buyerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "noOfTickets";
          type: "u16";
        }
      ];
    },
    {
      name: "raffleWithdraw";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "rafflerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "adminAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "adminTreasuryAccount";
          isMut: true;
          isSigner: false;
          docs: ["CHECK DOING"];
        },
        {
          name: "adminTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ticketMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rafflerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "declareWinner";
      accounts: [
        {
          name: "raffleAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "recentSlothashes";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "admin";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "treasury";
            type: "publicKey";
          },
          {
            name: "fee";
            type: "u64";
          },
          {
            name: "totalRaffles";
            type: "u64";
          },
          {
            name: "totalTickets";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "raffle";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "ticketMint";
            type: "publicKey";
          },
          {
            name: "rewards";
            type: {
              vec: {
                defined: "RaffleReward";
              };
            };
          },
          {
            name: "maxTickets";
            type: "u16";
          },
          {
            name: "endDate";
            type: "i64";
          },
          {
            name: "soldTickets";
            type: "u16";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "treasuryAccount";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "raffler";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "noOfRaffles";
            type: "u8";
          },
          {
            name: "ticketsSold";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "ticket";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "raffle";
            type: "publicKey";
          },
          {
            name: "tickets";
            type: {
              defined: "BitArray";
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "RaffleReward";
      type: {
        kind: "struct";
        fields: [
          {
            name: "reward";
            type: "publicKey";
          },
          {
            name: "randomNo";
            type: "u16";
          }
        ];
      };
    },
    {
      name: "BitArray";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tickets";
            type: {
              vec: "u64";
            };
          },
          {
            name: "amount";
            type: "u16";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "RaffleNotEnded";
      msg: "Raffle Not Ended";
    },
    {
      code: 6001;
      name: "RaffleEnded";
      msg: "Raffle already ended";
    },
    {
      code: 6002;
      name: "InvalidRaffleAccount";
      msg: "Invalid VRF Account";
    },
    {
      code: 6003;
      name: "NotAllowedToRequestWinner";
      msg: "Cannot request Winner Before Time";
    },
    {
      code: 6004;
      name: "NotAllowedToClaimNow";
      msg: "Not Allowed to Claim Early";
    },
    {
      code: 6005;
      name: "RandomNoNotSelected";
      msg: "Random Account not Selected";
    },
    {
      code: 6006;
      name: "NoWinner";
      msg: "Not a Winner";
    },
    {
      code: 6007;
      name: "AllSold";
      msg: "All Tickets Sold";
    },
    {
      code: 6008;
      name: "WrongEndDate";
      msg: "end_date is in past";
    },
    {
      code: 6009;
      name: "PriceCannotBeZero";
      msg: "price cannot be zero";
    },
    {
      code: 6010;
      name: "CannotBeMoreThanThree";
      msg: "Rewards Cannot be more than 3";
    },
    {
      code: 6011;
      name: "AllWinnerDeclared";
      msg: "All Winner's Declared";
    },
    {
      code: 6012;
      name: "RandomNotFound";
      msg: "Random No Not Found";
    },
    {
      code: 6013;
      name: "NoBalance";
      msg: "No Balance";
    }
  ];
};

export const IDL: CnftRaffle = {
  version: "0.1.0",
  name: "cnft_raffle",
  instructions: [
    {
      name: "createRaffler",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "rafflerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createRaffle",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "rafflerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "adminAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ticketMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "raffleTreasuryEscrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "endDate",
          type: "i64",
        },
        {
          name: "price",
          type: "u64",
        },
        {
          name: "maxTickets",
          type: "u16",
        },
      ],
    },
    {
      name: "addReward",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treeAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "merkleTree",
          isMut: true,
          isSigner: false,
        },
        {
          name: "logWrapper",
          isMut: false,
          isSigner: false,
        },
        {
          name: "compressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "bubblegumProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "root",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "dataHash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "creatorHash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
        {
          name: "index",
          type: "u32",
        },
      ],
    },
    {
      name: "claimPrize",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "treeAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "merkleTree",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rafflerAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ticketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "logWrapper",
          isMut: false,
          isSigner: false,
        },
        {
          name: "compressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "bubblegumProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "root",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "dataHash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "creatorHash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
        {
          name: "index",
          type: "u32",
        },
      ],
    },
    {
      name: "createTicket",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ticketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ticketMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "buyerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "noOfTickets",
          type: "u16",
        },
      ],
    },
    {
      name: "raffleWithdraw",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "rafflerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "adminAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "adminTreasuryAccount",
          isMut: true,
          isSigner: false,
          docs: ["CHECK DOING"],
        },
        {
          name: "adminTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ticketMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rafflerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "declareWinner",
      accounts: [
        {
          name: "raffleAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "recentSlothashes",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "admin",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "treasury",
            type: "publicKey",
          },
          {
            name: "fee",
            type: "u64",
          },
          {
            name: "totalRaffles",
            type: "u64",
          },
          {
            name: "totalTickets",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "raffle",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "ticketMint",
            type: "publicKey",
          },
          {
            name: "rewards",
            type: {
              vec: {
                defined: "RaffleReward",
              },
            },
          },
          {
            name: "maxTickets",
            type: "u16",
          },
          {
            name: "endDate",
            type: "i64",
          },
          {
            name: "soldTickets",
            type: "u16",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "treasuryAccount",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "raffler",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "noOfRaffles",
            type: "u8",
          },
          {
            name: "ticketsSold",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "ticket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "raffle",
            type: "publicKey",
          },
          {
            name: "tickets",
            type: {
              defined: "BitArray",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "RaffleReward",
      type: {
        kind: "struct",
        fields: [
          {
            name: "reward",
            type: "publicKey",
          },
          {
            name: "randomNo",
            type: "u16",
          },
        ],
      },
    },
    {
      name: "BitArray",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tickets",
            type: {
              vec: "u64",
            },
          },
          {
            name: "amount",
            type: "u16",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "RaffleNotEnded",
      msg: "Raffle Not Ended",
    },
    {
      code: 6001,
      name: "RaffleEnded",
      msg: "Raffle already ended",
    },
    {
      code: 6002,
      name: "InvalidRaffleAccount",
      msg: "Invalid VRF Account",
    },
    {
      code: 6003,
      name: "NotAllowedToRequestWinner",
      msg: "Cannot request Winner Before Time",
    },
    {
      code: 6004,
      name: "NotAllowedToClaimNow",
      msg: "Not Allowed to Claim Early",
    },
    {
      code: 6005,
      name: "RandomNoNotSelected",
      msg: "Random Account not Selected",
    },
    {
      code: 6006,
      name: "NoWinner",
      msg: "Not a Winner",
    },
    {
      code: 6007,
      name: "AllSold",
      msg: "All Tickets Sold",
    },
    {
      code: 6008,
      name: "WrongEndDate",
      msg: "end_date is in past",
    },
    {
      code: 6009,
      name: "PriceCannotBeZero",
      msg: "price cannot be zero",
    },
    {
      code: 6010,
      name: "CannotBeMoreThanThree",
      msg: "Rewards Cannot be more than 3",
    },
    {
      code: 6011,
      name: "AllWinnerDeclared",
      msg: "All Winner's Declared",
    },
    {
      code: 6012,
      name: "RandomNotFound",
      msg: "Random No Not Found",
    },
    {
      code: 6013,
      name: "NoBalance",
      msg: "No Balance",
    },
  ],
};
