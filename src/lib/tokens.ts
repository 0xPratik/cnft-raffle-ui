export type TokenType = {
  tokenName: string;
  mintAddress: string;
  decimals: number;
  tokenImage: string;
};

export const BONK: TokenType = {
  tokenName: "BONK",
  mintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  decimals: 5,
  tokenImage:
    "https://pbs.twimg.com/profile_images/1600956334635098141/ZSzYTrHf_400x400.jpg",
};

export const GUAC: TokenType = {
  tokenName: "GUAC",
  mintAddress: "AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR",
  decimals: 5,
  tokenImage:
    "https://shdw-drive.genesysgo.net/36JhGq9Aa1hBK6aDYM4NyFjR5Waiu9oHrb44j1j8edUt/image.png",
};

export const SOL: TokenType = {
  tokenName: "SOL",
  mintAddress: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  decimals: 6, // change this to 9 on mainnet
  tokenImage:
    "https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png",
};

export const TOKENS: TokenType[] = [SOL];

export function searchTokenByMintAddress(mintAddress: string) {
  return TOKENS.find((token) => token.mintAddress === mintAddress);
}
