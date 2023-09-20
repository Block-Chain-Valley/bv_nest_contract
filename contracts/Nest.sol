//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Nest {
    event BirdCreated(uint indexed _birdId, string _name, uint _ad, uint _exp, uint _level, uint _class);
    event PlantCreated(uint indexed _plantId, uint _hp, uint _expReward, uint _deadTime, uint _class);
    event PlantFed(uint indexed _birdId, uint _plantId, uint _hp, uint _expReward, uint _deadTime);
    event PlantRevived(uint indexed _plantId, uint _hp, uint _expReward, uint _deadTime);
    event BirdLevelUp(uint indexed _birdId, uint _level, uint _exp);

    enum BirdClass {
        Eagle,
        Pigeon,
        Duck,
        Crow
    }

    enum PlantClass {
        Grass,
        Tree
    }

    struct Bird {
        uint id;
        string name;
        uint ad;
        uint exp;
        uint level;
        BirdClass class;
    }

    struct Plant {
        uint id;
        uint hp;
        uint expReward;
        uint deadTime;
        PlantClass class;
    }

    mapping(address => uint[]) public birdIdsOf;
    mapping(uint => Bird) public birds;

    uint private constant INITIAL_BIRD_ID = 1;
    uint private constant INITIAL_PLANT_ID = 1;
    uint public birdId;
    uint public plantId;
    Plant[] public plants;

    uint public plantTimestamp;

    constructor() {
        birdId = INITIAL_BIRD_ID;
    }

    function createBird(string memory _name) public payable {
        require(msg.value == 0.01 ether, "Nest: NOT ENOUGH ETH");
        require(birdIdsOf[msg.sender].length < 1, "Nest: MAX ONE BIRD");

        uint _birdClass = 0;
        (uint adStart, uint adRange) = deClassBird(BirdClass(_birdClass));
        uint ad = random(adStart, adRange);
        uint startExp = 0;
        uint startLvl = 1;
        Bird memory bird = Bird(birdId, _name, ad, startExp, startLvl, BirdClass(_birdClass));
        birdIdsOf[msg.sender].push(birdId);
        birds[birdId] = bird;
        birdId++;

        emit BirdCreated(bird.id, bird.name, bird.ad, bird.exp, bird.level, uint(bird.class));
    }

    function createPlant(uint _plantClass) public {
        (uint hpStart, uint hpRange, uint expStart, uint expRange) = deClassPlant(PlantClass(_plantClass));
        uint hp = random(hpStart, hpRange);
        uint expReward = random(expStart, expRange);
        uint startTime = block.timestamp;
        Plant memory plant = Plant(plantId, hp, expReward, startTime, PlantClass(_plantClass));
        plants.push(plant);

        emit PlantCreated(plant.id, plant.hp, plant.expReward, plant.deadTime, uint(plant.class));
    }

    function feedPlant(uint _birdId, uint _plantId) public {
        require(birds[_birdId].id == _birdId, "Nest: NO BIRD");
        require(plants[_plantId].id == _plantId, "Nest: NO PLANT");
        require(plants[_plantId].hp > 0, "Nest: PLANT DEAD");

        Bird storage bird = birds[_birdId];
        Plant storage plant = plants[_plantId];

        require(bird.ad >= plant.hp, "Nest: NOT ENOUGH AD");

        // plant dead
        plant.hp = 0;
        plant.deadTime = block.timestamp;

        bird.exp += plant.expReward;
        plants[_plantId] = plant;

        emit PlantFed(bird.id, plant.id, plant.hp, plant.expReward, plant.deadTime);
    }

    function revivePlant(uint _plantId) public {
        require(plants[_plantId].id == _plantId, "Nest: NO PLANT");
        require(plants[_plantId].hp == 0, "Nest: PLANT NOT DEAD");
        require(block.timestamp - plants[_plantId].deadTime >= 10, "Nest: NOT ENOUGH TIME");

        (uint hpStart, uint hpRange, , ) = deClassPlant(PlantClass.Grass);
        Plant storage plant = plants[_plantId];
        plant.hp = random(hpStart, hpRange);

        emit PlantRevived(plant.id, plant.hp, plant.expReward, plant.deadTime);
    }

    function deClassBird(BirdClass _birdClass) internal pure returns (uint _start, uint _range) {
        if (_birdClass == BirdClass.Eagle) {
            return (10, 5);
        } else if (_birdClass == BirdClass.Pigeon) {
            return (15, 8);
        } else if (_birdClass == BirdClass.Duck) {
            return (30, 15);
        } else if (_birdClass == BirdClass.Crow) {
            return (50, 25);
        }
    }

    function deClassPlant(
        PlantClass _plantClass
    ) internal pure returns (uint _hpStart, uint _hpRange, uint _expStart, uint _expRange) {
        if (_plantClass == PlantClass.Grass) {
            return (3, 5, 2000, 1000);
        } else if (_plantClass == PlantClass.Tree) {
            return (20, 8, 5000, 2500);
        }
    }

    function random(uint _start, uint _range) internal view returns (uint _value) {
        uint randomHash = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        return _start + (randomHash % _range);
    }

    function levelUp(uint _birdId) public {
        require(birds[_birdId].id == _birdId, "Nest: NO BIRD");
        Bird storage bird = birds[_birdId];
        uint exp = bird.exp;
        uint level = bird.level;
        uint expRequired = level * 1000;
        require(exp > expRequired, "Nest: NOT ENOUGH EXP");
        if (exp >= expRequired) {
            bird.level = level + 1;
            bird.exp = exp - expRequired;
        }

        emit BirdLevelUp(bird.id, bird.exp, bird.level);
    }

    function retrieveBirdInfo()
        external
        view
        returns (uint _id, string memory _name, uint _ad, uint _exp, uint _level, uint _length, uint _class)
    {
        uint length = birdIdsOf[msg.sender].length;
        if (length == 0) return (0, "", 0, 0, 0, 0, 0);
        uint birdIdTemp = birdIdsOf[msg.sender][length - 1];

        Bird memory bird = birds[birdIdTemp];
        return (bird.id, bird.name, bird.ad, bird.exp, bird.level, birdIdsOf[msg.sender].length, uint(bird.class));
    }

    function retrievePlantInfo()
        external
        view
        returns (uint _id, uint _hp, uint _expReward, uint _deadTime, uint _class)
    {
        uint plantLength = plants.length;
        if (plantLength == 0) return (0, 0, 0, 0, 0);

        Plant memory plant = plants[plantLength - 1];
        return (plant.id, plant.hp, plant.expReward, plant.deadTime, uint(plant.class));
    }
}
