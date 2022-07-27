const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Code Unit Tests", async function () {
          let Code, interval //, raffleContract, vrfCoordinatorV2Mock, raffleEntranceFee, interval, player // , deployer
          const chainId = network.config.chainId
          const NewValue = ethers.utils.parseEther("0.000000000000001000") //ethers.utils.parseEther("0.3")
          // let owner
          // let addr1
          // let addr2

          beforeEach(async function () {
            const {deployer} = await getNamedAccounts()
            //const {second} = await getNamedAccounts()
            // //console.log(`second: ${second}`)
            // const {third} = await getNamedAccounts()
            // //accounts = await ethers.getSigners()
            //const [owner, addr1, addr2] = await ethers.getSigners()
            // console.log(`Accounts: ${addr1}`)
            await deployments.fixture(["all"])
            Code = await ethers.getContract("Code", deployer)
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
            interval = await Code.getInterval()
          })
          

          describe("constructor", async function () {
              it("intitiallizes the Code correctly", async function () {
                  const startPrice = await Code.getPrice()
                  assert.equal(startPrice.toString(), "1000,0")//Sha de cumplir la condicio perque el test doni OK
              })
            })
          describe("constructor", async function () {//PriceConversion
            it("sets the aggregator addresses correctly", async function () {
                const response = await Code.getPriceFeed()
                assert.equal(response, mockV3Aggregator.address)
            })
          })
          // describe("Eth Price", async function () {//PriceConversion
          //   it("Gets the price in ETH", async function () {
          //       const PriceConverted = await Code.PriceConversion()
          //       //assert.equal(response, mockV3Aggregator.address)
          //       console.log(`Preu: ${PriceConverted}`)
          //   })
          // })

          describe("changePrice", async function () {
            it ("Changes the Price correctly", async function () {
              const FirstPrice = await Code.getPrice()
              console.log(`Value1: ${FirstPrice/1e18}`)

              const SetNewPrice = await Code.changePrice(NewValue)//Code breaks here
              //await SetNewPrice.wait(1)

              const NewPrice = await Code.getPrice()
              console.log(`Value2: ${NewPrice}`)

              assert.equal(NewPrice.toString(), "1000,0")
            })
          })
          describe("Subscribing ...", async function () {
            it ("Quantity error", async function () {
              await expect(Code.Subscription({value: "100000"})).to.be.revertedWith( "Sub_NotQuantity()")
            })
            it ("Subscription wallets", async function () {
              await Code.Subscription({value: NewValue})
              // await Code.Subscription({value: NewValue}).second
              // await Code.Subscription({value: NewValue}).third
              
              const Subs = await Code.getSubscribers()
              console.log(`Number of subs: ${Subs}`)

              const Balance = await Code.getBalance()
              console.log(`Balance: ${Balance}`)

              // var List = []
              const List = await Code.getMembers()
              console.log(`Address list: ${List}`)
            })
            it ("Resubscription error", async function () {
              await Code.Subscription({value: NewValue})
              // await Code.Subscription({value: NewValue})
              await expect(Code.Subscription({value: NewValue})).to.be.revertedWith( "Already_SUB()")
            })
            it ("Wallets data", async function () {
              await Code.Subscription({value: NewValue})
              const WalletData = await Code.callTimer("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
              console.log(`Wallet Data: ${WalletData}`)
            })
            it ("Multiple wallets subscription", async function () {
              // await Code.Subscription({value: NewValue})
              const [owner, addr1, addr2] = await ethers.getSigners()
              await Code.connect(addr1).Subscription({value: NewValue})
              await Code.connect(addr2).Subscription({value: NewValue})

              const List = await Code.getMembers()
              console.log(`Address list: ${List}`)
            })
          })
          describe("Withdrawing ...", async function () {
            it ("withdraw function", async function () {
              await Code.Subscription({value: NewValue})
              const BalanceIni = await Code.getBalance()
              console.log(`Balance inicial: ${BalanceIni}`)
              await Code.Withdraw()
              const FinalBalance = await Code.getBalance()
              assert.equal(FinalBalance.toString(), "0")
            })
          })
          describe("Testing Upkeepers ... ", async function () {
            it ("Check", async function () {
              await Code.Subscription({value: NewValue})
              const Time1 = await Code.getInterval()
              console.log(`Time1 : ${Time1}`)
              await network.provider.send("evm_increaseTime", [Time1.toNumber() + 1])
              await network.provider.request({ method: "evm_mine", params: [] })
              const Time2 = await Code.getInterval()
              console.log(`Time2 : ${Time2}`)
              const [condition, WalletNum] = await Code.checkUpkeep([])
              console.log(`Condition : ${condition}`)
              console.log(`WalletNum : ${WalletNum}`)
              assert.equal(condition, true)

            })
            it ("Perform", async function () {
              await Code.Subscription({value: NewValue})
              await network.provider.send("evm_increaseTime", [interval.toNumber() - 1])
              await network.provider.request({ method: "evm_mine", params: [] })
              await Code.performUpkeep([])

              const {deployer} = await getNamedAccounts()
              console.log(`Accounts: ${deployer}`)
              const [SuperTimer, State] = await Code.callTimer(deployer)
              console.log(`Condition : ${SuperTimer}`)
              console.log(`State : ${State}`)
              assert.equal(SuperTimer, 999999999999999999999)
              assert.equal(State, 0)
              //Crida el upkeepneeded unicament de la funcio i mira que no es compleixi 
              const { upkeepNeeded } = await Code.callStatic.checkUpkeep("0x") //
              assert(!upkeepNeeded)
              
            })
          })
        })