const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert, expect } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Code Unit Tests", async function () {
        let Code //, raffleContract, vrfCoordinatorV2Mock, raffleEntranceFee, interval, player // , deployer
        let deployer
        const chainId = network.config.chainId
        const NewValue = ethers.utils.parseEther("0.1") //ethers.utils.parseEther("0.3")
        // let owner
        // let addr1
        // let addr2

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            console.log(`Deployer: ${deployer}`)
            Code = await ethers.getContract("Code", deployer)
        })
        it ("Subscription wallets", async function () {
            const SUB = await Code.Subscription({value: NewValue})
            //const transactionReceipt = await SUB.deploytransaction.wait(1)
            await SUB.wait(1)
            const CheckBalance = await Code.provider.getBalance(Code.address)
            const EtherForm = ethers.utils.formatEther(CheckBalance)
            console.log(`Balance: ${EtherForm}`)
            // const Subs = await Code.getSubscribers()
            // console.log(`Number of subs: ${Subs}`)

            const Money = await Code.Withdraw()
            await Money.wait(1)
            const endingBalance = await Code.provider.getBalance(Code.address)
            const EtherFormOut = ethers.utils.formatEther(endingBalance)
            console.log(`Balance: ${EtherFormOut}`)
            // const Balance = await Code.getBalance()
            // console.log(`Balance inicial: ${Balance}`)
        })
    })