import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  import { BaseERC20Token, ERC20Factory } from "../typechain-types";
  import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
  
  describe("ERC20Factory", function () {
    // We define a fixture to reuse the same setup in every test
    async function deployFactoryFixture() {
      // Contracts are deployed using the first signer/account by default
      const [owner, addr1, addr2] = await hre.ethers.getSigners();
  
      const ERC20FactoryFactory = await hre.ethers.getContractFactory("ERC20Factory");
      const factory = await ERC20FactoryFactory.deploy();
  
      return { factory, owner, addr1, addr2 };
    }
  
    describe("Token Creation", function () {
      it("Should deploy new ERC20 tokens", async function () {
        const { factory, owner, addr1 } = await loadFixture(deployFactoryFixture);
  
        // Create first token
        const tx1 = await factory.createToken("Test Token 1", "TT1", 1000);
        const receipt1 = await tx1.wait();
        const tokenCreatedEvent1 = receipt1?.logs.find(
          log => "fragment" in log && log.fragment?.name === 'TokenCreated'
        );
        expect(tokenCreatedEvent1).to.not.be.undefined;
        const tokenAddress1 = tokenCreatedEvent1?.args?.tokenAddress;
        
        // Check token count
        expect(await factory.getTokenCount()).to.equal(1n);
        
        // Create second token
        const tx2 = await factory.connect(addr1).createToken("Test Token 2", "TT2", 2000);
        const receipt2 = await tx2.wait();
        const tokenCreatedEvent2 = receipt2?.logs.find(
          log => "fragment" in log && log.fragment?.name === 'TokenCreated'
        );
        expect(tokenCreatedEvent2).to.not.be.undefined;
        const tokenAddress2 = tokenCreatedEvent2?.args?.tokenAddress;
        
        // Check token count
        expect(await factory.getTokenCount()).to.equal(2n);
        
        // Verify tokens exist
        expect(await factory.tokenExists(tokenAddress1)).to.be.true;
        expect(await factory.tokenExists(tokenAddress2)).to.be.true;
        
        // Check getAllTokens
        const allTokens = await factory.getAllTokens();
        expect(allTokens.length).to.equal(2);
        expect(allTokens[0]).to.equal(tokenAddress1);
        expect(allTokens[1]).to.equal(tokenAddress2);
        
        // Verify token properties
        const BaseERC20TokenFactory = await hre.ethers.getContractFactory("BaseERC20Token");
        const token1 = (BaseERC20TokenFactory.attach(tokenAddress1) as unknown) as BaseERC20Token;
        const token2 = (BaseERC20TokenFactory.attach(tokenAddress2) as unknown) as BaseERC20Token;
        
        expect(await token1.name()).to.equal("Test Token 1");
        expect(await token1.symbol()).to.equal("TT1");
        expect(await token1.totalSupply()).to.equal(hre.ethers.parseUnits("1000", 18));
        expect(await token1.balanceOf(owner.address)).to.equal(hre.ethers.parseUnits("1000", 18));
        
        expect(await token2.name()).to.equal("Test Token 2");
        expect(await token2.symbol()).to.equal("TT2");
        expect(await token2.totalSupply()).to.equal(hre.ethers.parseUnits("2000", 18));
        expect(await token2.balanceOf(addr1.address)).to.equal(hre.ethers.parseUnits("2000", 18));
      });
  
      it("Should emit TokenCreated event", async function() {
        const { factory, owner } = await loadFixture(deployFactoryFixture);
        
        await expect(factory.createToken("Event Test Token", "ETT", 1000))
          .to.emit(factory, "TokenCreated")
          .withArgs(anyValue, "Event Test Token", "ETT", 1000, owner.address);
      });
    });
  
    describe("Factory Admin Functions", function() {
      it("Should track all deployed tokens correctly", async function() {
        const { factory, owner, addr1, addr2 } = await loadFixture(deployFactoryFixture);
        
        // Deploy multiple tokens from different accounts
        await factory.createToken("Token A", "TKNA", 1000);
        await factory.connect(addr1).createToken("Token B", "TKNB", 2000);
        await factory.connect(addr2).createToken("Token C", "TKNC", 3000);
        
        // Verify token count
        expect(await factory.getTokenCount()).to.equal(3n);
        
        // Verify all tokens are tracked
        const allTokens = await factory.getAllTokens();
        expect(allTokens.length).to.equal(3);
        
        // Verify each token exists
        for (const tokenAddress of allTokens) {
          expect(await factory.tokenExists(tokenAddress)).to.be.true;
        }
        
        // Verify a random address doesn't exist as token
        const randomAddress = "0x1234567890123456789012345678901234567890";
        expect(await factory.tokenExists(randomAddress)).to.be.false;
      });
    });
  });