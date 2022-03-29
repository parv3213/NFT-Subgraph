import { SampleNFT, Transfer } from '../types/SampleNFT/SampleNFT';
import { Token, User } from '../types/schema';

export function handleTransfer(event: Transfer): void {
  let from = event.params.from.toHexString();
  let to = event.params.to.toHexString();
  let id = event.params.tokenId.toString();

  let token = Token.load(id);
  let user = User.load(to);

  if (user == null) {
    user = new User(to);
  }
  if (token == null) {
    token = new Token(id);
    token.tokenId = event.params.tokenId;
    token.creator = to;

    let metafitContract = SampleNFT.bind(event.address);
    token.contentURI = metafitContract.tokenURI(event.params.tokenId);
    token.createdAtTimestamp = event.block.timestamp;

    user.mintedNFT = event.params.tokenId;
  } else {
    token.previousOwner = from;
  }

  token.owner = to;

  user.save();
  token.save();
}
