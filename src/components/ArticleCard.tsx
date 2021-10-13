import { Box } from '@chakra-ui/layout';
import { Image, Stack, Text } from '@chakra-ui/react';
import router from 'next/router';
import Date from './Date';
import { VFC, memo } from 'react';

type Props = {
  id: string;
  date: string;
  title: string;
  image: string;
};

const ArticleCard: VFC<Props> = (props) => {
  const { id, date, title, image } = props;
  return (
    <Box
      w='300px'
      h='300px'
      bg='gray.100'
      borderRadius='20px'
      p='2'
      onClick={() => router.push(`/posts/${id}`)}
      _hover={{ opacity: 0.5, cursor: 'pointer' }}
      boxShadow='md'
    >
      <Stack textAlign='center'>
        <Image
          src={require(`../../posts/${id}/${image}`)}
          boxSize='160px'
          alt='thumbnail'
          m='auto'
          borderRadius='full'
          fit='contain'
        />
        <Text fontSize='lg' fontWeight='bold'>
          {title}
        </Text>
        <Date dateString={date} />
      </Stack>
    </Box>
  );
};

export default memo(ArticleCard);
