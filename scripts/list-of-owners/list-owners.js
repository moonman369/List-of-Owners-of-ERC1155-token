const { ethers } = require("hardhat");
const hre = require("hardhat");
const { modifyList } = require("./db-utils");

let owners = new Set(["0x0000000000000000000000000000000000000000"]);
let finOwners = [...owners];

async function main() {
  const [deployer, ...addrs] = await ethers.getSigners();
  const { fireNft } = await deployContract(deployer, "base-uri/");

  let tx = await fireNft.connect(addrs[0]).mintCollection(addrs[0].address, 10);
  let result = await tx.wait();
  let id = result.events[0].args.id;

  let operator = addrs[1];
  let from = addrs[0];

  await fireNft.connect(from).setApprovalForAll(operator.address, true);

  for (let i = 0; i < 5; i++) {
    let to = addrs[i];
    tx = await fireNft
      .connect(operator)
      .safeTransferFrom(from.address, to.address, id, 1, "0x00");
    result = await tx.wait();

    finOwners = await modifyList(
      fireNft,
      finOwners,
      result.events[0].args.from,
      result.events[0].args.to,
      result.events[0].args.id
    );
  }

  console.log(finOwners);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
  });
