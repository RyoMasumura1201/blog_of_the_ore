import { Box } from '@chakra-ui/layout';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { memo } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

const SearchBox = ({
  currentRefinement,
  refine,
}: {
  currentRefinement: string;
  refine: (string) => void;
}) => {
  return (
    <Box w='100%' m='auto'>
      <InputGroup>
        <Input
          placeholder='記事を検索'
          value={currentRefinement}
          onChange={(e) => refine(e.currentTarget.value)}
        />
        <InputLeftElement>
          <SearchIcon color='gray.700' />
        </InputLeftElement>
      </InputGroup>
    </Box>
  );
};

const CustomSearchBox: React.VFC = connectSearchBox(SearchBox);

export default memo(CustomSearchBox);
