"use client";

import { Item, RaffleCardInterface } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as anchor from "@coral-xyz/anchor";
import { RPC } from "@/lib/constants";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  addRewardIx,
  createRaffleIx,
  createRafflerIx,
} from "@/lib/program/instructions";
import { getUnixTimeStamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import clsx from "clsx";
import { useNftDataByOwner } from "@/hooks/useNftDataByOwner";
import { SelectImage } from "@/components/SelectImage";
import TokenSelector from "@/components/TokenSelector";
import { SOL, TokenType } from "@/lib/tokens";
import { useCheckIsRaffler } from "@/hooks/useCheckIfRaffler";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock4, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import RaffleImage from "@/components/ui/RaffleImage";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useCnftDataByOwner } from "@/hooks/useCnftDataByOwner";
import { useTxSigner } from "@/hooks/useTxSigner";

enum CreateStates {
  Step1,
  Step2,
  Step3,
}

export default function Create() {
  const router = useRouter();
  const queryClient = useQueryClient();
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const anchorWallet = useAnchorWallet();
  const { data, isPending, isError } = useCnftDataByOwner();
  const [selectedToken, setSelectedToken] = useState<TokenType>(SOL);
  console.log("selectedToken", selectedToken);
  const [createState, setCreateState] = useState<CreateStates>(
    CreateStates.Step1
  );
  const [enddate, setEndDate] = useState<Date>();
  const [selectedTokens, setSelectedTokens] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const raffler = useCheckIsRaffler();
  const [raffleData, setRaffleData] = useState<RaffleCardInterface>({
    assets: [],
    price: 0,
    endDate: null,
    ticketsTotal: 0,
    soldTickets: 0,
    ticketMint: "",
    treasuryAccount: "",
    raffle: "",
  });
  const { performTransaction, processing } = useTxSigner();

  const validateSteps = (step: 1 | 2 | 3): boolean => {
    if (step === 1) {
      return selectedTokens.length > 0;
    } else if (step === 2) {
      return !!selectedTokens && enddate !== undefined && raffleData.price > 0;
    } else if (step === 3) {
      return validateSteps(1) && validateSteps(2);
    }

    return false;
  };

  // logging this out to chec what is the response if the user does not have NFTs in thier wallet

  const createRaffleAndAddRewardTx = async () => {
    setIsLoading(true);
    try {
      if (!anchorWallet?.publicKey || !anchorWallet) {
        return;
      }

      if (!enddate) {
        // Replace with toast
        alert("Please select a end date");
        return;
      }
      const inxs: anchor.web3.TransactionInstruction[] = [];
      const additionInxs: anchor.web3.TransactionInstruction[] = [];

      if (!raffler) {
        console.log("Raffler is null", raffler);
        const ix = await createRafflerIx(anchorWallet as NodeWallet);
        if (!ix) {
          console.log("Ix is Null");
          return;
        }
        inxs.push(ix);
      }
      const unixTimeStamp = getUnixTimeStamp(enddate.getTime());
      const ticketMint = new anchor.web3.PublicKey(selectedToken.mintAddress);
      const price =
        raffleData.price * 10 ** (selectedToken?.decimals || 0) || 1;

      const raffleIx = await createRaffleIx(
        anchorWallet as NodeWallet,
        new anchor.BN(unixTimeStamp),
        new anchor.BN(price),
        // keeping this as 100 to fix the error but will need to get this from the user
        new anchor.BN(100),
        ticketMint
      );

      if (!raffleIx) {
        throw new Error("Failed to create Raffle Instruction");
      }

      inxs.push(raffleIx.ix);
      console.log("selectedTokens", selectedTokens);
      const rewardIxs = await Promise.all(
        selectedTokens.map((token) =>
          addRewardIx(
            anchorWallet as NodeWallet,
            token.id,
            new anchor.web3.PublicKey(token.compression.tree)
          )
        )
      );

      if (!rewardIxs) {
        throw new Error("Failed to create Reward Instruction");
      }

      if (rewardIxs) {
        rewardIxs.forEach((ix) => {
          if (ix !== undefined) {
            inxs.push(ix);
          }
        });
      }
      console.log("inxs", JSON.stringify(inxs));
      const txSigs = await performTransaction(inxs);

      console.log("txSigs", txSigs);

      if (txSigs?.length !== 0 && txSigs !== undefined) {
        await queryClient.invalidateQueries({ queryKey: ["raffleListing"] });
        router.push("/");
      }
    } catch (error: any) {
      console.log("Catched the Error on handler", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (anchorWallet?.publicKey === undefined) {
      router.push("/");
    }
  }, [anchorWallet, router]);

  return (
    <div className="flex flex-col w-full max-w-lg gap-1 mx-auto mt-8 text-gray-600 lg:max-w-4xl">
      <nav>
        <ul className="flex items-center justify-between w-full gap-2">
          <li
            className={clsx(
              "block text-center w-52 transition-opacity",
              createState !== CreateStates.Step1 && "opacity-60"
            )}
          >
            <button onClick={() => setCreateState(CreateStates.Step1)}>
              <span
                className={clsx(
                  "flex items-center justify-center w-12 h-12 p-4 mx-auto mb-2 text-primary border  border-ring  rounded-full",
                  createState == CreateStates.Step1 && "border-2 font-bold"
                )}
              >
                1
              </span>
              <span
                className={clsx(
                  createState == CreateStates.Step1 && "font-bold"
                )}
              >
                Select NFTs
              </span>
            </button>
          </li>
          <li className="w-full">
            <span className="block w-full p-[1px] bg-gray-300"></span>
          </li>
          <li
            className={clsx(
              "block text-center w-52 transition-opacity",
              createState !== CreateStates.Step2 && "opacity-60"
            )}
          >
            <button
              onClick={() =>
                validateSteps(1) && setCreateState(CreateStates.Step2)
              }
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-12 h-12 p-4 mx-auto mb-2 text-primary border border-ring rounded-full",
                  createState == CreateStates.Step2 &&
                    "border-2 border-primary font-bold"
                )}
              >
                2
              </span>
              <span
                className={clsx(
                  createState == CreateStates.Step2 && "font-bold"
                )}
              >
                Raffle Details
              </span>
            </button>
          </li>
          <li className="w-full">
            <span className="block w-full p-[1px] bg-gray-300"></span>
          </li>
          <li
            className={clsx(
              "block text-center w-52 transition-opacity",
              createState !== CreateStates.Step3 && "opacity-60"
            )}
          >
            <button
              onClick={() =>
                validateSteps(2) && setCreateState(CreateStates.Step3)
              }
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-12 h-12 p-4 mx-auto mb-2 text-primary border border-ring rounded-full",
                  createState == CreateStates.Step3 && "border-2 font-bold"
                )}
              >
                3
              </span>
              <span
                className={clsx(
                  createState == CreateStates.Step3 && "font-bold"
                )}
              >
                Confirm &amp; Transact
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-85">
        {createState === CreateStates.Step1 && (
          <div className="w-full max-w-3xl p-4 mx-auto">
            <div className="grid grid-cols-4 gap-4 max-h-[516px] overflow-auto">
              {data === undefined && isPending && (
                <>
                  <Skeleton className="w-full h-[160px] rounded-md" />
                  <Skeleton className="w-full h-[160px] rounded-md" />
                  <Skeleton className="w-full h-[160px] rounded-md" />
                  <Skeleton className="w-full h-[160px] rounded-md" />
                </>
              )}
              {data &&
                data.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (selectedTokens.includes(item)) {
                          const selTokens = selectedTokens;
                          console.log("selTokens", selTokens);
                          selTokens.splice(selTokens.indexOf(item), 1);
                          setSelectedTokens([...selTokens]);
                          // setRaffleData({
                          //   ...raffleData,
                          //   assets: raffleData.assets.filter(
                          //     (asset) => asset.reward.toString() !== item.id
                          //   ),
                          // });
                        } else {
                          setSelectedTokens([...selectedTokens, item]);
                          // setRaffleData({
                          //   ...raffleData,
                          //   assets: [
                          //     ...raffleData.assets,
                          //     item.id,
                          //   ],
                          // });
                        }
                      }}
                      className={clsx(
                        "overflow-hidden w-full h-[160px] object-cover rounded-md flex items-center justify-center transition-colors bg-gray-100 cursor-pointer  ",
                        selectedTokens.includes(item) &&
                          "border-4 border-primary"
                      )}
                    >
                      <SelectImage imageUri={item.content.links.image} />
                    </div>
                  );
                })}
              {isError && (
                <div className="flex items-center justify-center w-full h-full">
                  Error
                </div>
              )}
            </div>
            <div className="flex items-center justify-between w-full gap-2 py-4">
              <p className="text-md text-muted-foreground">
                * you can add upto 3 NFTs as rewards in a Raffle
              </p>
              <Button
                disabled={!validateSteps(1)}
                onClick={() => {
                  setCreateState(CreateStates.Step2);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {createState === CreateStates.Step2 && (
          <div className="flex flex-row w-full p-4 h-[516px] justify-around">
            <div>
              <RaffleImage
                imageSrc={selectedTokens.map(
                  (token) => token.content.links.image
                )}
              />
            </div>
            <div className="w-96 max-w-2xl p-4 ">
              <div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">End date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !enddate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {enddate ? (
                          format(enddate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={enddate}
                        onSelect={setEndDate}
                        disabled={{ before: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <Input
                    type="datetime-local"
                    className="w-full border-gray-300 rounded-lg"
                    onChange={(e) => {
                      setRaffleData({
                        ...raffleData,
                        endDate: new Date(e.currentTarget.value),
                      });
                    }}
                    value={dayjs(raffleData.endDate).format("YYYY-MM-DDTHH:mm")}
                  /> */}
                </div>
                {/* This is not required by the program we support 65,535 tickets by default */}
                {/* <div className="mb-4">
                  <label className="block mb-1 font-medium"># of tickets</label>
                  <input
                    type="number"
                    className="w-full border-gray-300 rounded-lg"
                    value={raffleData.ticketsTotal || ""}
                    onChange={(e) =>
                      setRaffleData({
                        ...raffleData,
                        ticketsTotal: Number(e.currentTarget.value),
                      })
                    }
                  />
                </div> */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Price per ticket
                  </label>
                  <Input
                    type="number"
                    className="w-full border-gray-300 rounded-lg"
                    value={raffleData.price || ""}
                    min={0}
                    step={0.1}
                    onChange={(e) =>
                      setRaffleData({
                        ...raffleData,
                        price: Number(e.currentTarget.value),
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Ticket Mint</label>
                  <TokenSelector
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-full gap-2 py-4">
                <Button onClick={() => setCreateState(CreateStates.Step1)}>
                  Back
                </Button>
                <Button
                  disabled={!validateSteps(2)}
                  onClick={() => setCreateState(CreateStates.Step3)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
        {createState === CreateStates.Step3 && (
          <div className="flex w-full max-w-4xl  p-4 mx-auto justify-around">
            <div className="lg:max-w-[500px] ">
              <RaffleImage
                imageSrc={selectedTokens.map(
                  (token) => token.content.links.image
                )}
              />
            </div>
            <div className="w-96 max-w-2xl p-4 ">
              <div className=" mb-6">
                <p className="text-xl font-medium">
                  Review and confirm raffle details.
                </p>
                <Separator />
              </div>
              <ul className="mb-8 space-y-2 text-sm">
                <li className="flex-row align-baseline">
                  {/* <div>
                    <Clock4 className="w-4 h-4" />
                  </div> */}
                  <strong className="  font-medium"> ends at</strong>:{" "}
                  <span className="font-bold">
                    {dayjs(enddate).format("dddd, MMMM D, YYYY h:mm A")}
                  </span>
                </li>
                <li className="flex-row align-baseline">
                  {/* <Ticket className="w-4 h-4" /> */}
                  <strong className="font-medium">
                    price per ticket
                  </strong>:{" "}
                  <span className="font-bold">
                    {raffleData.price} {selectedToken.tokenName}
                  </span>
                </li>
                {/* <li
                    className={clsx(
                      raffleData.ticketsTotal &&
                        raffleData.ticketsTotal - raffleData.soldTickets <=
                          10 &&
                        "text-orange-400"
                    )}
                  >
                    <strong className="font-semibold">Tickets remaining</strong>
                    :{" "}
                    {raffleData.ticketsTotal &&
                      raffleData.ticketsTotal - raffleData.soldTickets}
                    /{raffleData.ticketsTotal}
                  </li> */}
              </ul>
              <div className="flex items-center justify-between w-full gap-2">
                <Button
                  onClick={() => {
                    setCreateState(CreateStates.Step2);
                  }}
                >
                  Back
                </Button>
                <Button
                  disabled={!validateSteps(3)}
                  onClick={() => {
                    createRaffleAndAddRewardTx();
                  }}
                >
                  {isLoading ? "Creating Raffle..." : "Create Raffle"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
