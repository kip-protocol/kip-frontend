const KIPABI = [
  'function createCollection(uint256,uint256,uint256,uint8,string) external',
  'function uri(uint256) public view returns (string)',
  'event CreateCollection(uint256,address,uint256,uint256,uint256,uint8)',
]

const KIPQueryABI = [
  'function query(uint256,string) external',
  'function getCategoryCollections(uint8) external view returns(tuple(uint256,address,uint256,uint256,uint256,uint8,uint32,uint32)[])',
  'function getCollection(uint256) external view returns(tuple(uint256,address,uint256,uint256,uint256,uint8,uint32,uint32))',
  'function getQuestions(uint256) external view returns(tuple(uint256,uint256,string,address,address,uint256,bool)[])',
  'function getQuestionQueryor(uint256,uint256) external view returns(address)',
  'function getBalance(address) external view returns(uint256)',
  'function mint(address,uint256,string) external',
  'event Query(uint256,uint256,address)',
  'event Withdraw(address,uint256)',
]

const KIPTokenABI = [
  'function allowance(address,address) external view returns(uint256)',
  'function approve(address,uint256) external',
  'function balanceOf(address) external view returns(uint256)',
]

export { KIPABI, KIPQueryABI, KIPTokenABI }
