export type Degen = {
  version: "0.1.0";
  name: "degen";
  instructions: [
    {
      name: "createAdmin";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "adminAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryAccount";
          isMut: false;
          isSigner: false;
          docs: [
            "Should be a MultiSig Once we finalize which multisig then i can do a account owner check"
          ];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "fee";
          type: "u64";
        }
      ];
    },
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
          name: "adminAccount";
          isMut: true;
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
        },
        {
          name: "systemProgram";
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
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "claimerTokenAccount";
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
      args: [];
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
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authorityTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
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
            name: "noOfRewards";
            type: "u8";
          },
          {
            name: "rewards";
            type: {
              vec: {
                defined: "RewardWinner";
              };
            };
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
      name: "RewardWinner";
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

export const IDL: Degen = {
  version: "0.1.0",
  name: "degen",
  instructions: [
    {
      name: "createAdmin",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "adminAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryAccount",
          isMut: false,
          isSigner: false,
          docs: [
            "Should be a MultiSig Once we finalize which multisig then i can do a account owner check",
          ],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "fee",
          type: "u64",
        },
      ],
    },
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
          name: "adminAccount",
          isMut: true,
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
        {
          name: "systemProgram",
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
    {
      name: "claimPrize",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
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
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "claimerTokenAccount",
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
      args: [],
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
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authorityTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
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
            name: "noOfRewards",
            type: "u8",
          },
          {
            name: "rewards",
            type: {
              vec: {
                defined: "RewardWinner",
              },
            },
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
      name: "RewardWinner",
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
