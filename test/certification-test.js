const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certification", function () {
  it("Should mint and transfer a new NFT to someone", async function () {
    const Certification = await ethers.getContractFactory("Certification");
    const certification = await Certification.deploy();
    await certification.deployed();

    const [owner, recipient] = await ethers.getSigners();
    const metadataURI = 'cid/test.png';

    let balance = await certification.balanceOf(recipient.address);
    expect(balance).to.equal(0);

    const newlyMintedCertification = await certification.learnToMint(recipient.address, metadataURI,{value: ethers.utils.parseEther('0.01')});
    
    // Wait until the transaction is mined
    await newlyMintedCertification.wait();

    balance = await certification.balanceOf(recipient.address);
    expect(balance).to.equal(1);

    expect(await certification.isCertificationOwned(metadataURI)).to.equal(true);

  });
});
