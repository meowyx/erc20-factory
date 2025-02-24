import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenFactoryModule = buildModule("TokenFactoryModule", (m) => {
  // Deploy the ERC20Factory contract
  const factory = m.contract("ERC20Factory");
  
  // Optional parameters for initial token deployment
  const initialTokenName = m.getParameter("initialTokenName", "Example Token");
  const initialTokenSymbol = m.getParameter("initialTokenSymbol", "EXMP");
  const initialTokenSupply = m.getParameter("initialTokenSupply", 10000);
  
  // Optionally deploy an initial token
  // This is commented out but can be uncommented if needed
  /*
  const initialToken = m.call(
    factory,
    "createToken",
    [initialTokenName, initialTokenSymbol, initialTokenSupply],
    { id: "deployExampleToken" }
  );
  */
  
  return { factory };
});

export default TokenFactoryModule;