/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USDC, TOKENS, TokenType } from "@/lib/tokens";

interface TokenSelectorProps {
  selectedToken: TokenType;
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenType>>;
}

function TokenSelector({
  selectedToken,
  setSelectedToken,
}: TokenSelectorProps) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Token" />
      </SelectTrigger>
      <SelectContent>
        {TOKENS.map((token) => {
          return (
            <SelectItem
              key={token.mintAddress}
              value={token.tokenName}
              onClick={() => setSelectedToken(token)}
            >
              <div className="flex items-center">
                <img
                  src={token.tokenImage}
                  alt={token.tokenName}
                  className="w-6 h-6 mr-2"
                />
                <span>{token.tokenName}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default TokenSelector;
